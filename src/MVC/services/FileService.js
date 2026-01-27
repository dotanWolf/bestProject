/**
 * File Service
 * Contains business logic for file/folder operations (Single Responsibility Principle)
 */
const fileRepository = require("../repositeries/FileRepositery");
const permissionRepository = require("../repositeries/PermissionRepositery");
const client = require("../client");
const File = require("../models/Entry");
const PermissionService = require("../services/PermissionsService");
const UserRepositery = require("../repositeries/UserRepositery");

class FileService {
  async createFile(fileData, userId) {
    if (fileData.parentId) {
      // user set a custom parent id, we must check its a folder and userId can edit it
      const folder = await fileRepository.findById(fileData.parentId);
      if (!folder) {
        const error = new Error("folder doesnt exist");
        error.statusCode = 404;
        throw error;
      }

      if (!this.hasEditAccess(folder, userId)) {
        // user cant edit the folder, he cant add entries there
        const error = new Error("no access to add files to this folder");
        error.statusCode = 403;
        throw error;
      }
    }
    // Create file in repository
    const file = await fileRepository.create({
      ...fileData,
      ownerId: userId,
    });

    const user = await UserRepositery.findById(userId);
    //create a permmision for the owner of the file
    const ownerPermmision = await PermissionService.createPermission(
      file._id,
      {
        userId: userId,
        role: "owner",
        email: user.email,
      },
      userId,
    );

    // If it's a file (not folder), save to cpp server
    if (file.type == "file") {
      const result = await client.saveFile(file._id, file.content);
      if (!result.success) {
        // couldnt save, delete from repository
        await fileRepository.delete(file._id);
        const error = new Error("Failed to save file to storage server");
        error.statusCode = 500;
        throw error;
      }
    }
    return file;
  }

  async getFileById(fileId, userId) {
    const file = await fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Check permissions
    if (!this.hasReadAccess(file, userId)) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return file;
  }

  async getRootFiles(userId) {
    console.log("Fetching root files for user:", userId);
    // Get files at root level (parentId = null) owned by user
    const ownedFiles = await fileRepository.findByOwnerAndParent(userId, null);

    return ownedFiles.map((file) => {
      return {
        ...file,
        role: "owner",
        isStarred: file.isStarred,
      };
    });
  }

  async getFolderEntries(userId, parentId) {
    const folderFiles = await fileRepository.findByOwnerAndParent(
      userId,
      parentId,
    );
    console.log("Fetched folder entries:", folderFiles);
    return folderFiles;
  }

  async getFolders(userId) {
    // 1. Get all folders owned by the user
    const ownedEntries = (await fileRepository.findByOwnerId(userId)) || [];
    const ownedFolders = ownedEntries.filter(
      (entry) => entry.type === "folder",
    );

    // 2. Get all permissions for this user with the role 'editor'
    const sharedPermissions =
      (await permissionRepository.findByUserId(userId)) || [];

    // 3. Convert those permissions into actual folder objects
    const sharedEditorFoldersPromises = sharedPermissions
      .filter((perm) => perm.role === "editor") // Only editors
      .map(async (perm) => await fileRepository.findById(perm.fileId)); // Get the file/folder object

    const sharedEditorFolders = await Promise.all(sharedEditorFoldersPromises);
    const filteredSharedEditorFolders = sharedEditorFolders.filter(
      (entry) =>
        entry && entry.type == "folder" && !entry.ownerId.equals(userId), // Avoid duplicates if owner has a permission record
    );
    console.log("Shared editor folders:", filteredSharedEditorFolders);
    // 4. Merge and return
    return [...ownedFolders, ...filteredSharedEditorFolders];
  }

  async updateFile(fileId, updates, userId) {
    var file = await fileRepository.findById(fileId);

    // Update in repository
    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }
    // Check permissions
    if (!this.hasEditAccess(file, userId)) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    file = await fileRepository.update(fileId, updates);

    // If updating file content, update in Assignment 2 server
    if (file.type == "file") {
      var result = await client.deleteFile(fileId);
      if (!result.success) {
        const error = new Error("Failed to update file in storage server");
        error.statusCode = 500;
        throw error;
      }
      result = await client.saveFile(fileId, updates.content);
      if (!result.success) {
        const error = new Error("Failed to update file in storage server");
        error.statusCode = 500;
        throw error;
      }
    }
    return file;
  }

  async deleteFile(fileId, userId) {
    const file = await fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can delete
    if (!file.ownerId.equals(userId)) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    // If it's a folder, delete all children recursively
    if (file.type == "folder") {
      try {
        await this.deleteFolderContents(fileId);
      } catch (error) {
        throw error;
      }
    }

    // If it's a file, delete from Assignment 2 server
    if (file.type == "file") {
      const result = await client.deleteFile(fileId);
      if (!result.success) {
        const error = new Error("Failed to update file in storage server");
        error.statusCode = 500;
        throw error;
      }
    }

    // Delete permissions associated with this file
    await permissionRepository.deleteByFileId(fileId);

    // Delete from repository
    return await fileRepository.delete(fileId);
  }

  async deleteFolderContents(folderId) {
    const children = await fileRepository.findByParentId(folderId);

    for (const child of children) {
      if (child.type == "folder") {
        await this.deleteFolderContents(child._id);
      } else if (child.type == "file") {
        const result = await client.deleteFile(child._id);
        if (!result.success) {
          const error = new Error("Failed to update file in storage server");
          error.statusCode = 500;
          throw error;
        }
      }

      await permissionRepository.deleteByFileId(child._id);
      await fileRepository.delete(child._id);
    }
  }

  async hasReadAccess(file, userId) {
    // Owner has access
    if (file.ownerId.equals(userId)) {
      return true;
    }

    // Check permissions
    const permission = await permissionRepository.findByFileAndUser(
      file._id,
      userId,
    );
    return permission && permission.canRead();
  }

  async hasEditAccess(file, userId) {
    // Owner has access
    if (file.ownerId.equals(userId)) {
      return true;
    }

    // Check permissions
    const permission = await permissionRepository.findByFileAndUser(
      file._id,
      userId,
    );
    return permission && permission.canEdit();
  }

  async getSharedEntries(userId) {
    console.log("Fetching shared entries for user:", userId);
    // 1. Get all permission records for this user
    const sharedPermissions =
      (await permissionRepository.findByUserId(userId)) || [];
    console.log("Shared permissions:", sharedPermissions);
    // 2. Map permissions to file objects and inject metadata
    const sharedFilesPromises = sharedPermissions.map(async (p) => {
      const file = await fileRepository.findById(p.fileId);
      console.log("Processing permission:", p, "File:", file);
      // Only include if file exists, user is not the owner, and not trashed
      if (file && !file.ownerId.equals(userId) && !file.isTrashed) {
        console.log("Adding shared file:", file);
        return {
          ...file,
          role: p.role, // Unlocks Rename for Editors
          isStarred: p.isStarred, // Individualized star status
          permissionId: p._id, // Used to target the correct PATCH/DELETE route
        };
      }
      return null;
    });

    const resolvedFiles = await Promise.all(sharedFilesPromises);
    const finalFiles = resolvedFiles.filter((f) => f !== null);
    console.log("Final shared files:", finalFiles);
    return finalFiles;
  }

  async getEntriesByStatus(userId, isTrashed) {
    const allFiles = await fileRepository.findByOwnerId(userId);
    return allFiles.filter((file) => file.isTrashed === isTrashed);
  }

  async getEntriesForStarred(userId, isStarred) {
    const ownedFiles = (await fileRepository.findByOwnerId(userId)) || [];
    const processedOwned = ownedFiles
      .filter((f) => f.isStarred === isStarred && !f.isTrashed)
      .map((f) => ({ ...f, role: "owner" }));

    const sharedPermissions =
      (await permissionRepository.findByUserId(userId)) || [];
    const sharedPromises = sharedPermissions
      .filter((p) => p.isStarred === isStarred)
      .map(async (p) => {
        const file = await fileRepository.findById(p.fileId);
        if (file && !file.isTrashed) {
          return {
            ...file,
            role: p.role,
            isStarred: p.isStarred,
            permissionId: p._id,
          };
        }
        return null;
      });

    const resolvedShared = await Promise.all(sharedPromises);
    const processedShared = resolvedShared.filter((f) => f !== null);
    return [...processedOwned, ...processedShared];
  }

  async getRecentFiles(userId) {
    const recentOwned = (await fileRepository.getRecentEntries(userId)) || [];
    const processedOwned = recentOwned
      .filter((file) => !file.isTrashed)
      .map((file) => ({
        ...file,
        role: "owner",
        isStarred: file.isStarred,
      }));
    const sharedPermissions =
      (await permissionRepository.findByUserId(userId)) || [];
    const processedShared = sharedPermissions
      .map(async (p) => {
        const file = await fileRepository.findById(p.fileId);
        if (file && file.ownerId.toString() !== userId.toString() && !file.isTrashed) {
          return {
            ...file,
            role: p.role,
            isStarred: p.isStarred,
            permissionId: p._id,
          };
        }
        return null;
      })
      .filter((f) => f !== null);

    const allRecent = [...processedOwned, ...processedShared];

    allRecent.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB - dateA;
    });

    return allRecent;
  }
}
module.exports = new FileService();

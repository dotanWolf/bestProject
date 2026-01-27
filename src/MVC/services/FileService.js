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
    // Validate file data
    const validationErrors = File.validate(fileData);
    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join(", "));
      error.statusCode = 400;
      throw error;
    }

    const parentId = fileData.parentId;
    if (parentId) {
      // user set a custom parent id, we must check its a folder and userId can edit it
      const folder = fileRepository.findById(parentId);
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
    const file = fileRepository.create({
      ...fileData,
      ownerId: userId,
    });

    const user = UserRepositery.findById(userId);
    //create a permmision for the owner of the file
    const ownerPermmision = PermissionService.createPermission(
      file.id,
      {
        userId: userId,
        role: "owner",
        email: user.email,
      },
      userId
    );

    // If it's a file (not folder), save to cpp server
    if (file.isFile()) {
      const result = await client.saveFile(file.id, file.content);
      if (!result.success) {
        // couldnt save, delete from repository
        fileRepository.delete(file.id);
        const error = new Error("Failed to save file to storage server");
        error.statusCode = 500;
        throw error;
      }
    }
    return file;
  }

  getFileById(fileId, userId) {
    const file = fileRepository.findById(fileId);

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

  getRootFiles(userId) {
    // Get files at root level (parentId = null) owned by user
    const ownedFiles = fileRepository.findByOwnerAndParent(userId, null);
    console.log(fileRepository.files)
    // // Also get files shared with user at root level
    // const sharedPermissions = permissionRepository.findByUserId(userId);
    // const sharedFileIds = sharedPermissions.map(p => p.fileId);
    // const sharedFiles = sharedFileIds
    //     .map(id => fileRepository.findById(id))
    //     .filter(file => file && file.parentId === null);

    // // Combine and remove duplicates
    // const fileMap = new Map();
    // [...ownedFiles, ...sharedFiles].forEach(file => fileMap.set(file.id, file));

    return ownedFiles.map(file => {return {
        ...file,
        role: "owner", 
        isStarred: file.isStarred 
      };
    });
  }

  getFolderEntries(userId, parentId) {
    const folderFiles = fileRepository.findByOwnerAndParent(userId, parentId);
    return folderFiles;
  }

  getFolders(userId) {
    // 1. Get all folders owned by the user
    const ownedEntries = fileRepository.findByOwnerId(userId) || [];
    const ownedFolders = ownedEntries.filter((entry) => entry.isFolder());

    // 2. Get all permissions for this user with the role 'editor'
    const sharedPermissions = permissionRepository.findByUserId(userId) || [];

    // 3. Convert those permissions into actual folder objects
    const sharedEditorFolders = sharedPermissions
      .filter((perm) => perm.role === "editor") // Only editors
      .map((perm) => fileRepository.findById(perm.fileId)) // Get the file/folder object
      .filter(
        (entry) => entry && entry.isFolder() && entry.ownerId !== userId // Avoid duplicates if owner has a permission record
      );

    // 4. Merge and return
    return [...ownedFolders, ...sharedEditorFolders];
  }

  async updateFile(fileId, updates, userId) {
    var file = fileRepository.findById(fileId);

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

    file = fileRepository.update(fileId, updates);

    // If updating file content, update in Assignment 2 server
    if (file.isFile()) {
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
    const file = fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can delete
    if (file.ownerId !== userId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    // If it's a folder, delete all children recursively
    if (file.isFolder()) {
      try {
        await this.deleteFolderContents(fileId);
      } catch (error) {
        throw error;
      }
    }

    // If it's a file, delete from Assignment 2 server
    if (file.isFile()) {
      const result = await client.deleteFile(fileId);
      if (!result.success) {
        const error = new Error("Failed to update file in storage server");
        error.statusCode = 500;
        throw error;
      }
    }

    // Delete permissions associated with this file
    permissionRepository.deleteByFileId(fileId);

    // Delete from repository
    return fileRepository.delete(fileId);
  }

  async deleteFolderContents(folderId) {
    const children = fileRepository.findByParentId(folderId);

    for (const child of children) {
      if (child.isFolder()) {
        await this.deleteFolderContents(child.id);
      } else if (child.isFile()) {
        const result = await client.deleteFile(child.id);
        if (!result.success) {
          const error = new Error("Failed to update file in storage server");
          error.statusCode = 500;
          throw error;
        }
      }

      permissionRepository.deleteByFileId(child.id);
      fileRepository.delete(child.id);
    }
  }

  hasReadAccess(file, userId) {
    // Owner has access
    if (file.ownerId === userId) {
      return true;
    }

    // Check permissions
    const permission = permissionRepository.findByFileAndUser(file.id, userId);
    return permission && permission.canRead();
  }

  hasEditAccess(file, userId) {
    // Owner has access
    if (file.ownerId === userId) {
      return true;
    }

    // Check permissions
    const permission = permissionRepository.findByFileAndUser(file.id, userId);
    return permission && permission.canEdit();
  }
  getSharedEntries(userId) {
  // 1. Get all permission records for this user
  const sharedPermissions = permissionRepository.findByUserId(userId) || [];

  // 2. Map permissions to file objects and inject metadata
  return sharedPermissions
    .map(p => {
      const file = fileRepository.findById(p.fileId);
      // Only include if file exists, user is not the owner, and not trashed
      if (file && file.ownerId !== userId && !file.isTrashed) {
        return { 
          ...file, 
          role: p.role,           // Unlocks Rename for Editors
          isStarred: p.isStarred, // Individualized star status
          permissionId: p.id      // Used to target the correct PATCH/DELETE route
        };
      }
      return null;
    })
    .filter(f => f !== null);
}
  getEntriesByStatus(userId, isTrashed) {
    const allFiles = fileRepository.findByOwnerId(userId);
    return allFiles.filter((file) => file.isTrashed === isTrashed);
  }
 getEntriesForStarred(userId, isStarred) {
  const ownedFiles = fileRepository.findByOwnerId(userId) || [];
  const processedOwned = ownedFiles
    .filter(f => f.isStarred === isStarred && !f.isTrashed)
    .map(f => ({ ...f, role: 'owner' })); 

  const sharedPermissions = permissionRepository.findByUserId(userId) || [];
  const processedShared = sharedPermissions
    .filter(p => p.isStarred === isStarred) 
    .map(p => {
      const file = fileRepository.findById(p.fileId);
      if (file && !file.isTrashed) {
        return { 
          ...file, 
          role: p.role,           
          isStarred: p.isStarred, 
          permissionId: p.id      
        };
      }
      return null;
    })
    .filter(f => f !== null);
  return [...processedOwned, ...processedShared];
} 

  getRecentFiles(userId) {
   const recentOwned = fileRepository.getRecentEntries(userId) || [];
    const processedOwned = recentOwned
      .filter((file) => !file.isTrashed)
      .map((file) => ({ 
          ...file, 
          role: "owner",           
          isStarred: file.isStarred 
      }));
    const sharedPermissions = permissionRepository.findByUserId(userId) || [];
    const processedShared = sharedPermissions.map((p) => {
        const file = fileRepository.findById(p.fileId);
   if (file && file.ownerId !== userId && !file.isTrashed) {
          return {
            ...file,
            role: p.role,          
            isStarred: p.isStarred, 
            permissionId: p.id      
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

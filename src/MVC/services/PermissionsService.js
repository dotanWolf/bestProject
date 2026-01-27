/**
 * Permission Service
 * Contains business logic for permission operations (Single Responsibility Principle)
 */
const permissionRepository = require("../repositeries/PermissionRepositery");
const fileRepository = require("../repositeries/FileRepositery");
const Permission = require("../models/Permission");
const userRepository = require("../repositeries/UserRepositery");
const FileService = require("./FileService");

class PermissionService {
  async getPermissions(fileId, userId) {
    const file = await fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can view permissions
    console.log("userId from token", userId);
    console.log("file ownerId", file.ownerId);
    if (!file.ownerId.equals(userId)) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }
    return await permissionRepository.findByFileId(fileId);
  }

  async createPermission(fileId, permissionData, userId) {
    const file = await fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can create permissions
    if (!file.ownerId.equals(userId)) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    if (!permissionData.userId) {
      const error = new Error("userId is required");
      error.statusCode = 400;
      throw error;
    }

    if (!userRepository.findById(permissionData.userId)) {
      const error = new Error("user doesnt exist");
      error.statusCode = 404;
      throw error;
    }

    // Check if permission already exists for this user
    const existing = await permissionRepository.findByFileAndUser(
      fileId,
      permissionData.userId,
    );

    if (existing) {
      const error = new Error("Permission already exists for this user");
      error.statusCode = 404;
      throw error;
    }

    // Create permission
    return permissionRepository.create({
      ...permissionData,
      fileId,
    });
  }

  async updatePermission(fileId, permissionId, updates, userId) {
    const file = await fileRepository.findById(fileId);
    const permission = await permissionRepository.findById(permissionId);
    // 1. Basic Validation
    if (!file)
      throw Object.assign(new Error("File not found"), { statusCode: 404 });
    if (!permission || !permission.fileId.equals(fileId)) {
      throw Object.assign(new Error("Permission not found"), {
        statusCode: 404,
      });
    }
    // 2. Authorization Logic
    const isOwner = file.ownerId.equals(userId);
    const isSelfUpdate = permission.userId.equals(userId);
    if (!isOwner && !isSelfUpdate) {
      throw Object.assign(new Error("Access denied"), { statusCode: 403 });
    }
    // 3. Selective Update Logic
    let finalUpdates = {};
    if (isOwner) {
      // Owners can change roles or star status for others
      if (updates.role) {
        if (!["viewer", "editor", "owner"].includes(updates.role)) {
          throw Object.assign(new Error("Invalid role"), { statusCode: 400 });
        }
        finalUpdates.role = updates.role;
      }
      if (updates.hasOwnProperty("isStarred"))
        finalUpdates.isStarred = updates.isStarred;
    } else {
      if (updates.hasOwnProperty("isStarred")) {
        finalUpdates.isStarred = updates.isStarred;
      } else {
        throw Object.assign(
          new Error("Forbidden: You can only update your star status"),
          { statusCode: 403 },
        );
      }
    }
    return await permissionRepository.update(permissionId, finalUpdates);
  }

  async deletePermission(fileId, permissionId, userId) {
    const file = await fileRepository.findById(fileId);
    const permission = await permissionRepository.findById(permissionId);

    // 1. Basic Validation
    if (!file)
      throw Object.assign(new Error("File not found"), { statusCode: 404 });
    if (!permission || !permission.fileId.equals(fileId)) {
      throw Object.assign(new Error("Permission not found"), {
        statusCode: 404,
      });
    }

    const isOwner = file.ownerId.equals(userId);
    const isSelfDelete = permission.userId.equals(userId);

    // 2. Logic Change: Allow Owner OR the user themselves to delete the permission
    if (!isOwner && !isSelfDelete) {
      throw Object.assign(
        new Error("Access denied: Only owner or self can remove access"),
        { statusCode: 403 },
      );
    }

    // 3. Perform Delete
    return await permissionRepository.delete(permissionId);
  }

  async getFilesWithPermissions(userId) {
    const sharedPermissions =
      (await permissionRepository.findByUserId(userId)) || [];

    return sharedPermissions
      .map(async (p) => {
        const file = await fileRepository.findById(p.fileId);
        if (!file) return null;

        return {
          ...file,
          role: p.role,
          isStarred: p.isStarred || false, // כוכב אישי לכל משתמש
        };
      })
      .filter(async (file) => {
        if (!file) return false;
        if (file.parentId == null) return true;

        const parentPerm = await permissionRepository.findByFileAndUser(
          file.parentId,
          userId,
        );
        return !(parentPerm && parentPerm.canRead());
      });
  }

  async getFilesWithPermissionsbyParentId(userId, parentId) {
    // 1. Get ALL files that live inside this parent folder
    const filesInFolder = (await fileRepository.findByParentId(parentId)) || [];

    // 2. Map the files to an array of Booleans (Wait for all DB checks)
    const results = await Promise.all(
      filesInFolder.map(async (file) => {
        // Logic stays exactly as you wrote it, just wrapped in Promise.all
        const directPerm = await permissionRepository.findByFileAndUser(
          file._id,
          userId,
        );

        if (directPerm && directPerm.canRead()) return true;
        return false;
      }),
    );

    // 3. Filter the original files using the resolved booleans
    return filesInFolder.filter((_, index) => results[index]);
  }
}

module.exports = new PermissionService();

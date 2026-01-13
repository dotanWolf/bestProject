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
  getPermissions(fileId, userId) {
    const file = fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can view permissions
    if (file.ownerId !== userId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }
    console.log(permissionRepository.permissions);
    return permissionRepository.findByFileId(fileId);
  }

  createPermission(fileId, permissionData, userId) {
    const file = fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can create permissions
    if (file.ownerId !== userId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    // Validate permission data
    const validationErrors = Permission.validate(permissionData);
    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join(", "));
      error.statusCode = 400;
      throw error;
    }

    if (!userRepository.findById(permissionData.userId)) {
      const error = new Error("user doesnt exist");
      error.statusCode = 404;
      throw error;
    }

    // Check if permission already exists for this user
    const existing = permissionRepository.findByFileAndUser(
      fileId,
      permissionData.userId
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

  updatePermission(fileId, permissionId, updates, userId) {
    const file = fileRepository.findById(fileId);

    if (!updates.role) {
      const error = new Error("must provide role");
      error.statusCode = 400;
      throw error;
    }

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can update permissions
    if (file.ownerId !== userId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    const permission = permissionRepository.findById(permissionId);

    if (!permission || permission.fileId !== fileId) {
      const error = new Error("Permission not found");
      error.statusCode = 404;
      throw error;
    }

    // Validate role if provided
    if (updates.role && !["viewer", "editor", "owner"].includes(updates.role)) {
      const error = new Error("Invalid role");
      error.statusCode = 400;
      throw error;
    }

    return permissionRepository.update(permissionId, updates);
  }

  deletePermission(fileId, permissionId, userId) {
    const file = fileRepository.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }

    // Only owner can delete permissions
    if (file.ownerId !== userId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    const permission = permissionRepository.findById(permissionId);

    if (!permission || permission.fileId !== fileId) {
      const error = new Error("Permission not found");
      error.statusCode = 404;
      throw error;
    }

    return permissionRepository.delete(permissionId);
  }

  getFilesWithPermissions(userId) {
    const sharedPermissions = permissionRepository.findByUserId(userId) || [];
    const sharedFileIds = sharedPermissions.map((p) => p.fileId);

    return sharedFileIds
      .map((id) => fileRepository.findById(id))
      .filter((file) => {
        // 1. If file doesn't exist, skip it
        if (!file) return false;

        // 2. If it's a root-level shared file, include it
        if (file.parentId == null) return true;

        // 3. If it's in a folder, check if user has access to that folder
        const parentPerm = permissionRepository.findByFileAndUser(
          file.parentId,
          userId
        );
        if (parentPerm && parentPerm.canRead()) {
          return false;
        }
        return true;
      });
  }

  getFilesWithPermissionsbyParentId(userId, parentId) {
    // 1. Get ALL files that live inside this parent folder
    const filesInFolder = fileRepository.findByParentId(parentId) || [];

    // 2. Filter them based on whether the user is allowed to see them
    return filesInFolder.filter((file) => {
      // Check if user has direct permission on this file
      const directPerm = permissionRepository.findByFileAndUser(
        file.id,
        userId
      );
      if (directPerm && directPerm.canRead()) return true;

      return false;
    });
  }
}

module.exports = new PermissionService();

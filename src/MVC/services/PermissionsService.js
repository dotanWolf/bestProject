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
    const permission = permissionRepository.findById(permissionId);
    // 1. Basic Validation
    if (!file) throw Object.assign(new Error("File not found"), { statusCode: 404 });
    if (!permission || permission.fileId !== fileId) {
        throw Object.assign(new Error("Permission not found"), { statusCode: 404 });
    }
    // 2. Authorization Logic
    const isOwner = file.ownerId === userId;
    const isSelfUpdate = permission.userId === userId;
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
        if (updates.hasOwnProperty('isStarred')) finalUpdates.isStarred = updates.isStarred;
    } else {
        if (updates.hasOwnProperty('isStarred')) {
            finalUpdates.isStarred = updates.isStarred;
        } else {
            throw Object.assign(new Error("Forbidden: You can only update your star status"), { statusCode: 403 });
        }
    }
    return permissionRepository.update(permissionId, finalUpdates);
}

  deletePermission(fileId, permissionId, userId) {
    const file = fileRepository.findById(fileId);
    const permission = permissionRepository.findById(permissionId);

    // 1. Basic Validation
    if (!file) throw Object.assign(new Error("File not found"), { statusCode: 404 });
    if (!permission || permission.fileId !== fileId) {
        throw Object.assign(new Error("Permission not found"), { statusCode: 404 });
    }

    const isOwner = file.ownerId === userId;
    const isSelfDelete = permission.userId === userId;

    // 2. Logic Change: Allow Owner OR the user themselves to delete the permission
    if (!isOwner && !isSelfDelete) {
      throw Object.assign(new Error("Access denied: Only owner or self can remove access"), { statusCode: 403 });
    }

    // 3. Perform Delete
    return permissionRepository.delete(permissionId);
  }

  getFilesWithPermissions(userId) {
  const sharedPermissions = permissionRepository.findByUserId(userId) || [];
  
  return sharedPermissions
    .map((p) => {
      const file = fileRepository.findById(p.fileId);
      if (!file) return null;

      return { 
        ...file, 
        role: p.role, 
        isStarred: p.isStarred || false // כוכב אישי לכל משתמש
      };
    })
    .filter((file) => {
      if (!file) return false;
      if (file.parentId == null) return true;

      const parentPerm = permissionRepository.findByFileAndUser(file.parentId, userId);
      return !(parentPerm && parentPerm.canRead());
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

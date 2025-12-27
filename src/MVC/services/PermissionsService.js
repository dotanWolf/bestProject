/**
 * Permission Service
 * Contains business logic for permission operations (Single Responsibility Principle)
 */
const permissionRepository = require('../repositeries/PermissionRepositery');
const fileRepository = require('../repositeries/FileRepositery');
const Permission = require('../models/Permission');
const userRepository = require('../repositeries/UserRepositery')

class PermissionService {
  getPermissions(fileId, userId) {
    const file = fileRepository.findById(fileId);

    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      throw error;
    }

    // Only owner can view permissions
    if (file.ownerId !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }
    return permissionRepository.findByFileId(fileId);
  }

  createPermission(fileId, permissionData, userId) {
    const file = fileRepository.findById(fileId);

    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      throw error;
    }

    // Only owner can create permissions
    if (file.ownerId !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }

    // Validate permission data
    const validationErrors = Permission.validate(permissionData);
    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    if (!userRepository.findById(permissionData.userId)) {
      const error = new Error("user doesnt exist");
      error.statusCode = 404;
      throw error;
    }

    // Check if permission already exists for this user
    const existing = permissionRepository.findByFileAndUser(fileId, permissionData.userId);

    if (existing) {
      const error = new Error('Permission already exists for this user');
      error.statusCode = 404;
      throw error;
    }

    // Create permission
    return permissionRepository.create({
      ...permissionData,
      fileId
    });
  }

  updatePermission(fileId, permissionId, updates, userId) {
    const file = fileRepository.findById(fileId);

    if (!updates.role) {
      const error = new Error('must provide role');
      error.statusCode = 400;
      throw error;
    }

    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      throw error;
    }

    // Only owner can update permissions
    if (file.ownerId !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }

    const permission = permissionRepository.findById(permissionId);


    if (!permission || permission.fileId !== fileId) {
      const error = new Error('Permission not found');
      error.statusCode = 404;
      throw error;
    }

    // Validate role if provided
    if (updates.role && !['viewer', 'editor', 'owner'].includes(updates.role)) {
      const error = new Error('Invalid role');
      error.statusCode = 400;
      throw error;
    }

    return permissionRepository.update(permissionId, updates);
  }


  deletePermission(fileId, permissionId, userId) {
    const file = fileRepository.findById(fileId);

    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      throw error;
    }

    // Only owner can delete permissions
    if (file.ownerId !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }

    const permission = permissionRepository.findById(permissionId);

    if (!permission || permission.fileId !== fileId) {
      const error = new Error('Permission not found');
      error.statusCode = 404;
      throw error;
    }

    return permissionRepository.delete(permissionId);
  }
}

module.exports = new PermissionService();
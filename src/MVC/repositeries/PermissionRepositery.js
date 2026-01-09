/**
 * Permission Repository
 * Handles all data access operations for permissions (Single Responsibility Principle)
 */
const Permission = require('../models/Permission');
const crypto = require('crypto')

class PermissionRepository {
  constructor() {
    this.permissions = new Map();
  }

  /**
   * Create a new permission
   */
  create(permissionData) {
    const permission = new Permission({
      id: crypto.randomUUID(),
      ...permissionData
    });
    this.permissions.set(permission.id, permission);
    return permission;
  }

  /**
   * Find permission by ID
   */
  findById(id) {
    return this.permissions.get(id) || null;
  }

  /**
   * Find all permissions for a file
   */
  findByFileId(fileId) {
    const permissions = Array.from(this.permissions.values());
    return permissions.filter(p => p.fileId == fileId);
  }

  /**
   * Find permission by file and user
   */
  findByFileAndUser(fileId, userId) {
    const permissions = Array.from(this.permissions.values());
    return permissions.find(p => p.fileId === fileId && p.userId === userId) || null;
  }

  /**
   * Find all permissions for a user
   */
  findByUserId(userId) {
    const permissions = Array.from(this.permissions.values());
    return permissions.filter(p => p.userId === userId);
  }

  /**
   * Update permission
   */
  update(id, updates) {
    const permission = this.permissions.get(id);
    if (!permission) {
      return null;
    }

    permission.role = updates.role
    return permission;
  }

  /**
   * Delete permission
   */
  delete(id) {
    return this.permissions.delete(id);
  }

  /**
   * Delete all permissions for a file
   */
  deleteByFileId(fileId) {
    const permissions = this.findByFileId(fileId);
    permissions.forEach(p => this.delete(p.id));
  }

  /**
   * Delete all permissions for a user
   */
  deleteByUserId(userId) {
    const permissions = this.findByUserId(userId);
    permissions.forEach(p => this.delete(p.id));
  }
}
module.exports = new PermissionRepository();
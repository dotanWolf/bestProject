const Permission = require('../models/Permission');

class PermissionRepository {
  
  /**
   * Create a new permission
   */
  async create(permissionData) {
    const permission = new Permission(permissionData);
    return await permission.save();
  }

  /**
   * Find permission by ID
   */
  async findById(id) {
    return await Permission.findById(id);
  }

  /**
   * Find all permissions for a file
   * Useful for showing the "Shared with" list
   */
  async findByFileId(fileId) {
    return await Permission.find({ fileId });
  }

  /**
   * Find permission by file and user
   */
  async findByFileAndUser(fileId, userId) {
    return await Permission.findOne({ fileId, userId });
  }

  /**
   * Find all permissions for a user
   * Useful for showing a "Shared with me" section
   */
  async findByUserId(userId) {
    return await Permission.find({ userId });
  }

  /**
   * Update permission by ID
   */
  async update(id, updates) {
    return await Permission.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: false 
    });
  }

  /**
   * Delete permission
   */
  async delete(id) {
    const result = await Permission.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Delete all permissions for a file (e.g. when file is deleted)
   */
  async deleteByFileId(fileId) {
    return await Permission.deleteMany({ fileId });
  }

  /**
   * Delete all permissions for a user (e.g. when user is deleted)
   */
  async deleteByUserId(userId) {
    return await Permission.deleteMany({ userId });
  }
}

module.exports = new PermissionRepository();
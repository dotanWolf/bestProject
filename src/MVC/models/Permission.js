class Permission {
  constructor({ id, fileId, userId, role, createdAt }) {
    this.id = id;
    this.fileId = fileId;
    this.userId = userId;
    this.role = role; // 'viewer', 'editor', 'owner', 'none'
  }

  static validate(permissionData) {
    const errors = [];
    
    if (!permissionData.userId) {
      errors.push('User ID is required');
    }
    if (!permissionData.role || !['viewer', 'editor', 'owner', 'none'].includes(permissionData.role)) {
      errors.push('Role must be "viewer", "editor", "none" or "owner"');
    }
    return errors;
  }

  canRead() {
    return ['viewer', 'editor', 'owner'].includes(this.role);
  }

  canEdit() {
    return ['editor', 'owner'].includes(this.role);
  }

  isOwner() {
    return this.role === 'owner';
  }
}

module.exports = Permission;

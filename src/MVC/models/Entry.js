class Entry {
  constructor({ id, name, type, ownerId, parentId, content, isTrashed = false, isStarred = false, createdAt, updatedAt }) {
    const currentTime = new Date().toISOString()
    this.id = id;
    this.name = name;
    this.type = type; // 'file' or 'folder'
    this.ownerId = ownerId;
    this.parentId = parentId || null; // null means root level '/'
    this.content = content || null; //  for files
    this.isTrashed = isTrashed; 
    this.isStarred = isStarred; // <--- Make sure this is in constructor
    this.createdAt = createdAt || currentTime;
    this.updatedAt = updatedAt || currentTime;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      ownerId: this.ownerId,
      parentId: this.parentId,
      content: this.content,
      isTrashed: this.isTrashed,
      isStarred: this.isStarred, // <--- Don't forget to return this
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  // UPDATED: Added isUpdate flag to allow partial validation
  static validate(fileData, isUpdate = false) {
    const errors = [];

    // 1. Name Validation
    // If it's a new file (isUpdate=false), name is required.
    // If it's an update, we only check name if the user is trying to change it.
    if (!isUpdate && !fileData.name) {
      errors.push('Name is required');
    }

    // 2. Type Validation
    if (!isUpdate && !fileData.type) {
       // Type is mandatory for creation
       errors.push('Type is required');
    } else if (fileData.type && !['file', 'folder'].includes(fileData.type)) {
       // If type IS provided (create or update), it must be valid
       errors.push('Type must be "file" or "folder"');
    }

    // 3. Content Validation (Only for files)
    // We only check this if type is 'file' AND (it's a new entry OR content is being updated)
    const isFile = fileData.type === 'file' || (isUpdate && fileData.content !== undefined);
    if (isFile && !isUpdate && fileData.content === undefined) {
      errors.push('Content is required for files');
    }

    return errors;
  }

  isFile() {
    return this.type === 'file';
  }

  isFolder() {
    return this.type === 'folder';
  }
  _refreshUpdatedAt() {
    this.updatedAt = new Date().toISOString();
  }
  // UPDATED: Only overwrite properties if they exist in 'updates'
  updateFile(updates) {
    let changed = false;
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.content !== undefined) this.content = updates.content;
    if (updates.parentId !== undefined) this.parentId = updates.parentId;
    if (updates.isTrashed !== undefined) this.isTrashed = updates.isTrashed;
    if (updates.isStarred !== undefined) this.isStarred = updates.isStarred;
    if (changed) this._refreshUpdatedAt();
  }

  // UPDATED: Only overwrite properties if they exist in 'updates'
  updateFolder(updates) {
    let changed = false;
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.parentId !== undefined) this.parentId = updates.parentId;
    if (updates.isTrashed !== undefined) this.isTrashed = updates.isTrashed;
    if (updates.isStarred !== undefined) this.isStarred = updates.isStarred;
    if (changed) this._refreshUpdatedAt();
  }
}

module.exports = Entry;
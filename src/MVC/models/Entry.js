  class Entry {
  constructor({ id, name, type, ownerId, parentId, content}) {
      this.id = id;
      this.name = name;
      this.type = type; // 'file' or 'folder'
      this.ownerId = ownerId;
      this.parentId = parentId || null; // null means root level '/'
      this.content = content || null; //  for files
    }

    toJSON() {
      return {
          id: this.id,
          name: this.name,
          type: this.type,
          ownerId: this.ownerId,
          parentId: this.parentId,
          content: this.content
      }
    }

    static validate(fileData) {
      const errors = [];
      
      if (!fileData.name) {
        errors.push('Name is required');
      }

      if (!fileData.type || !['file', 'folder'].includes(fileData.type)) {
        errors.push('Type must be "file" or "folder"');
      }
      
      if (fileData.type === 'file' && fileData.content === undefined) {
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

    updateFile(updates) {
      this.name = updates.name
      this.content = updates.content
      this.parentId = updates.parentId
    }
  
      updateFolder(updates) {
      this.name = updates.name
      this.parentId = updates.parentId
    }
  }

module.exports = Entry;
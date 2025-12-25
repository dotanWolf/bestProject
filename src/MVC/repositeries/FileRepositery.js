const File = require('../models/Entry');
const crypto = require('crypto')

class FileRepository {
    constructor() {
        this.files = new Map();
    }

    create(fileData) {
        const file = new Entry({
            id: crypto.randomUUID(),
            ...fileData
        });
        this.files.set(file.id, file);
        return file;
    }

    findById(id) {
        return this.files.get(id) || null;
    }

    findAll() {
        return Array.from(this.files.values());
    }

    findByOwnerId(ownerId) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.ownerId === ownerId);
    }

    findByOwnerAndParent(ownerId, parentId) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.ownerId === ownerId && file.parentId === parentId);
    }

    findByParentId(parentId) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.parentId === parentId);
    }

    searchByName(query) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.name.includes(query));
    }

    searchByContent(query) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.isFile() && file.content.includes(query));
    }

    search(query) {
        const byName = this.searchByName(query);
        const byContent = this.searchByContent(query);

        // Combine and remove duplicates
        const resultMap = new Map();
        [...byName, ...byContent].forEach(file => resultMap.set(file.id, file));

        return Array.from(resultMap.values());
    }

    /**
     * Update file/folder
     */
    update(id, updates) {
        const file = this.files.get(id);
        if (!file) {
            return null;
        }

        if (file.isFile()) {
            file.updateFile(updates);
        }
        if (file.isFolder()) {
            file.updateFolder(updates)
        }
        return file;
    }

    /**
     * Delete file/folder
     */
    delete(id) {
        return this.files.delete(id);
    }

    /**
     * Delete all files/folders in a folder (recursive)
     */
    deleteByParentId(parentId) {
        const children = this.findByParentId(parentId);

        children.forEach(child => {
            if (child.isFolder()) {
                // Recursively delete children
                this.deleteByParentId(child.id);
            }
            this.delete(child.id);
        });
    }
}

// Singleton pattern
module.exports = new FileRepository();
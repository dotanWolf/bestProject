/**
 * File Service
 * Contains business logic for file/folder operations (Single Responsibility Principle)
 */
const fileRepository = require('../repositeries/FileRepositery');
const permissionRepository = require('../repositories/PermissionRepositery');
const client = require('../Client');
const File = require('../models/File');

class FileService {
    async createFile(fileData, userId) {
        // Validate file data
        const validationErrors = File.validate(fileData);
        if (validationErrors.length > 0) {
            const error = new Error(validationErrors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        // Create file in repository
        const file = fileRepository.create({
            ...fileData,
            ownerId: userId
        });

        // If it's a file (not folder), save to cpp server
        if (file.isFile()) {
            const result = await Client.saveFile(file.id, file.content);
            
            if (!result.success) {
                // couldnt save, delete from repository
                fileRepository.delete(file.id);
                const error = new Error('Failed to save file to storage server');
                error.statusCode = 500;
                throw error;
            }
        }
        return file;
  }

    getFileById(fileId, userId) {
        const file = fileRepository.findById(fileId);
        
        if (!file) {
        const error = new Error('File not found');
        error.statusCode = 404;
        throw error;
        }

        // Check permissions
        if (!this.hasReadAccess(file, userId)) {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
        }

        return file;
    }

    getRootFiles(userId) {
        // Get files at root level (parentId = null) owned by user
        const ownedFiles = fileRepository.findByOwnerAndParent(userId, null);
        
        // Also get files shared with user at root level
        const sharedPermissions = permissionRepository.findByUserId(userId);
        const sharedFileIds = sharedPermissions.map(p => p.fileId);
        const sharedFiles = sharedFileIds
        .map(id => fileRepository.findById(id))
        .filter(file => file && file.parentId === null);

        // Combine and remove duplicates
        const fileMap = new Map();
        [...ownedFiles, ...sharedFiles].forEach(file => fileMap.set(file.id, file));
        
        return Array.from(fileMap.values());
    }

    async updateFile(fileId, updates, userId) {
        const oldEntry = fileRepository.getFileById(fileId)
        if (!oldEntry) {
            const error = new Error('File not found');
            error.statusCode = 404;
            throw error;
        }

        // Check permissions
        if (!this.hasEditAccess(file, userId)) {
            const error = new Error('Access denied');
            error.statusCode = 403;
            throw error;
        }

        // Validate updates
        const validationErrors = File.validate(updates);
        if (validationErrors.length > 0) {
            const error = new Error(validationErrors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        // Update in repository
        const file = fileRepository.update(fileId, updates);
        
        if (oldEntry.isFile()) {
            const result = await Client.deleteFile(fileId);
            if (!result.success) {
                fileRepository.delete(file.id);
                const error = new Error('Failed to update file in storage server');
                error.statusCode = 500;
                throw error;
            }
        }

        // If updating file content, update in Assignment 2 server
        if (file.isFile()) {
            const result = await Client.createFile(fileId, updates.content);
            if (!result.success) {
                const error = new Error('Failed to update file in storage server');
                error.statusCode = 500;
                throw error;
            }
        }

        return file
    }

    async deleteFile(fileId, userId) {
        const file = fileRepository.findById(fileId);
        
        if (!file) {
            const error = new Error('File not found');
            error.statusCode = 404;
            throw error;
        }

        // Only owner can delete
        if (file.ownerId !== userId) {
            const error = new Error('Access denied');
            error.statusCode = 403;
            throw error;
        }

        // If it's a folder, delete all children recursively
        if (file.isFolder()) {
            try {
                await this.deleteFolderContents(fileId);
            } catch (error) {
                throw error
            }
        }

        // If it's a file, delete from Assignment 2 server
        if (file.isFile()) {
            const result = await Client.deleteFile(fileId);
            if (!result.success) {
                const error = new Error('Failed to update file in storage server');
                error.statusCode = 500;
                throw error;
            }
        }

        // Delete permissions associated with this file
        permissionRepository.deleteByFileId(fileId);

        // Delete from repository
        return fileRepository.delete(fileId);
    }

    async deleteFolderContents(folderId) {
        const children = fileRepository.findByParentId(folderId);
        
        for (const child of children) {
        if (child.isFolder()) {
            await this.deleteFolderContents(child.id);
        } else if (child.isFile()) {
           const result = await Client.deleteFile(child.id);
            if (!result.success) {
                const error = new Error('Failed to update file in storage server');
                error.statusCode = 500;
                throw error;
            }
        }
        
        permissionRepository.deleteByFileId(child.id);
        fileRepository.delete(child.id);
        }
    }

    hasReadAccess(file, userId) {
        // Owner has access
        if (file.ownerId === userId) {
            return true;
        }

        // Check permissions
        const permission = permissionRepository.findByFileAndUser(file.id, userId);
        return permission && permission.canRead();
    }

    hasEditAccess(file, userId) {
        // Owner has access
        if (file.ownerId === userId) {
            return true;
        }

        // Check permissions
        const permission = permissionRepository.findByFileAndUser(file.id, userId);
        return permission && permission.canEdit();
    }
}

module.exports = new FileService();
const { permissions } = require('../repositeries/PermissionRepositery')
const FileService = require('../services/FileService')
const PermissionsService = require('../services/PermissionsService')
const Entry = require('../models/Entry');

/**
 * Standardized Header Helper
 * Note: Express automatically lowercases header keys (userid, token)
 */

const getRootEntries = (req, res) => {
    const userId = req.user.userId; 

    if (!userId)
        return res.status(400).json({error: "user id and token required"});
    try {
        const files = FileService.getRootFiles(userId);
        return res.status(200).json(files);
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getFolderEntries = (req, res) => {
    const parentId = req.headers.parentId
    const userId = req.user.userId; 
    if (!userId)
        return res.status(400).json({error: "user id and token required"});
    try {
        const files = FileService.getFolderEntries(userId, parentId);
        return res.status(200).json(files);
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getTrashEntries = async (req, res) => {
    const userId = req.get('userid'); // Lowercase check
    
    if (!userId) {
        return res.status(400).json({ error: "User ID required" });
    }

    try {
        // Call the service method we fixed earlier
        // This fetches ALL files (root + subfolders) that are trashed
        const files = FileService.getEntriesByStatus(userId, true);
        
        return res.status(200).json(files);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const getStarredEntries = async (req, res) => {
    const userId = req.get('userid'); // Lowercase check
    
    if (!userId) {
        console.log("HOW COME NO USER ID?");
        return res.status(400).json({ error: "User ID required" });
    }

    try {
        // Call the service method we fixed earlier
        // This fetches ALL files (root + subfolders) that are starred
        const files = FileService.getEntriesForStarred(userId, true);
        
        return res.status(200).json(files);
    } catch (error) {
        console.error("Error in getStarredEntries:", error);
        return res.status(500).json({ error: error.message });
    }
};
const createEntry = async (req, res) => {
    const userId = req.user.userId; 

    if (!userId)
        return res.status(400).json({error: "user id and token required"});
    
    if (!req.body)
        return res.status(400).json({error: "must provide a json with entry fields"});

    try {
        const file = await FileService.createFile(req.body, userId);
        // Returns the file object so the Frontend can update the UI immediately
        return res.status(201).json(file); 
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getEntry = (req, res) => {
    const fileId = req.params.id;
    const userId = req.user.userId; 

    if (!userId)
        return res.status(400).json({error: "user id required"});

    try {
        const file = FileService.getFileById(fileId, userId);
        return res.status(200).json(file);
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const updateEntry = async (req, res) => {
    const fileId = req.params.id;
    const userId = req.get('userid');

    if (!userId)
        return res.status(400).json({error: "user id required"});

    if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({error: "must provide a json with entry fields"});
    console.log("DEBUG HEADERS:", req.headers);
    const validationErrors = Entry.validate(req.body, true);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(', ') });
    }

    try {
        const file = await FileService.updateFile(fileId, req.body, userId);
        return res.status(200).json(file);
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const deleteEntry = async (req, res) => {
    const fileId = req.params.id;
    const userId = req.headers.userid; 

    if (!userId)
        return res.status(400).json({error: "user id required"});

    try {
        await FileService.deleteFile(fileId, userId);
        return res.status(204).end();
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const getPermissions = (req, res) => {
    const fileId = req.params.id;
    const userId = req.headers.userid; 

    if (!userId)
        return res.status(400).json({error: "user id required"});

    try {
        const permissions = PermissionsService.getPermissions(fileId, userId);
        return res.status(200).json(permissions);
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const createPermissions = (req, res) => {
    const fileId = req.params.id;
    const userId = req.headers.userid; 
    
    if (!userId)
        return res.status(400).json({error: "user id required"});
    if (!req.body)
        return res.status(400).json({error: "must provide a json with permission fields"});
    try {
        const permission = PermissionsService.createPermission(fileId, req.body, userId);
        return res.status(201).location(`/api/permissions/${permission.id}`).end();
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const updatePermisssion = (req, res) => {
    const fileId = req.params.id;
    const permId = req.params.pId;
    const userId = req.headers.userid; 
    if (!userId)
        return res.status(400).json({error: "user id required"});
    if (!req.body)
        return res.status(400).json({error: "must provide a json with permission fields"});
    try {
        PermissionsService.updatePermission(fileId, permId, req.body, userId);
        return res.status(200).end();
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}

const deletePermission = (req, res) => {
    const fileId = req.params.id;
    const permId = req.params.pId;
    const userId = req.headers.userid; 
    if (!userId)
        return res.status(400).json({error: "user id required"});
    try {
        PermissionsService.deletePermission(fileId, permId, userId);
        return res.status(204).end();
    } catch (error) {
        return res.status(error.statusCode || 500).json({error: error.message});
    }
}


module.exports = {
    getRootEntries,
    getFolderEntries,
    getTrashEntries,
    getStarredEntries,
    createEntry,
    getEntry,
    updateEntry,
    deleteEntry,
    getPermissions,
    createPermissions,
    updatePermisssion,
    deletePermission
}
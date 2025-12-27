const { permissions } = require('../repositeries/PermissionRepositery')
const FileService = require('../services/FileService')
const PermissionsService = require('../services/PermissionsService')

// gets a user id in the http header
const getAllEntries = (req, res) => {
    const userId = req.headers.id
    if (!userId)
        return res.status(400).json({error: "user id required"})
    const files = FileService.getRootFiles(userId)
    return res.status(200).json(files)
}

// gets a name, location, userId, type = {"file", "dir"}
// if the type is a file, also needs a content field
// saves the new entry under a uniuqe id through the cpp server
 const createEntry = async (req, res) => {
    const userId = req.headers.id
    if (!userId)
        return res.status(400).json({error: "user id required"})
    if (!req.body)
        return res.status(400).json({error: "must provide a json with entry fields"})
    try {
        const file = await FileService.createFile(req.body, userId)
        return res.status(201).location(`/api/files/${file.id}`).end()
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
}

const getEntry = (req, res) => {
    const fileId = req.params.id
    const userId = req.headers.id
    if (!userId)
        return res.status(400).json({error: "user id required"})
    try {
        const file = FileService.getFileById(fileId, userId)
        return res.status(200).json(file)
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
}

// gets a name, location, userId, type = {"file", "dir"}
// if the type is a file, also needs a content field
// also gets the entries id in the request parameter
// if an entry exists with the given id, it deletes it
// and saves a new entry with the new parameters in the cpp server
// under the same id
const updateEntry = async (req, res) => {
    // otherwise get the id provided
    const fileId = req.params.id
    const userId = req.headers.id
        if (!userId)
            return res.status(400).json({error: "user id required"})
        if (!req.body)
            return res.status(400).json({error: "must provide a json with entry fields"})
        try {
            const file = await FileService.updateFile(fileId, req.body, userId)
            return res.status(200).json(file)
        } catch (error) {
            return res.status(error.statusCode).json({error: error.message})
        }
}

const deleteEntry = async (req, res) => {
    const fileId = req.params.id
    const userId = req.headers.id
    if (!userId)
        return res.status(400).json({error: "user id required"})

    try {
        await FileService.deleteFile(fileId, userId)
        return res.status(204).end()
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
}

const getPermissions = (req, res) => {
    const fileId = req.params.id
    const userId = req.headers.id

    if (!userId)
        return res.status(400).json({error: "user id required"})

    try {
        const permissions = PermissionsService.getPermissions(fileId, userId)
        return res.status(200).json(permissions)
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
}

const createPermissions = (req, res) => {
    const fileId = req.params.id
    const userId = req.headers.id
    
    if (!userId)
        return res.status(400).json({error: "user id required"})
    if (!req.body)
        return res.status(400).json({error: "must provide a json with permission fields"})
    try {
        const permission = PermissionsService.createPermission(fileId, req.body, userId)
        res.status(201).location(`/api/permissions/${permission.id}`).end()
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
}

const updatePermisssion = (req, res) => {
    const fileId = req.params.id
    const permId = req.params.pId
    const userId = req.headers.id
    if (!userId)
        return res.status(400).json({error: "user id required"})
    if (!req.body)
        return res.status(400).json({error: "must provide a json with permission fields"})
    try {
        PermissionsService.updatePermission(fileId, permId, req.body, userId)
        return res.status(200).end()
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
}

const deletePermission = (req, res) => {
    const fileId = req.params.id
    const permId = req.params.pId
    const userId = req.headers.id
    if (!userId)
        return res.status(400).json({error: "user id required"})
    try {
        PermissionsService.deletePermission(fileId, permId, userId)
        return res.status(204).end()
    } catch (error) {
        return res.status(error.statusCode).json({error: error.message})
    }
}


module.exports = {
    getAllEntries,
    createEntry,
    getEntry,
    updateEntry,
    deleteEntry,
    getPermissions,
    createPermissions,
    updatePermisssion,
    deletePermission
}

const FileService = require('../services/FileService')
const PermissionsService = require('../services/PermissionsService')

// gets a user id in the http header
const getAllEntries = (req, res) => {
    const userId = req.header.id
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
    try {
        const file = FileService.createFile(req.body, userId)
        return res.status(201).json(file).location(`/api/files/${file.id}`)
    } catch (error) {
        return res.status(error.statusCode).end()
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
        return res.status(error.statusCode).end()
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

        try {
            const file = FileService.updateFile(fileId, req.body, userId)
            return res.status(200).json(file)
        } catch (error) {
            return res.status(error.statusCode).end()
        }
}

const deleteEntry = async (req, res) => {
    const fileId = req.headers.id
    const userId = req.headers.id
    if (!userId)
        return res.status(400).json({error: "user id required"})

    try {
        FileService.deleteFile(fileId, userId)
        return res.status(204)
    } catch (error) {
        return res.status(error.statusCode).end()
    }
}

const getPermissions = (req, res) => {
    const fileId = req.params.id
    const userId = req.headers.id

    if (!userId)
        return res.status(400).json({error: "user id required"})

    try {
        PermissionsService.getPermissions(fileId, userId)
        return res.status(200)
    } catch (error) {
        return res.status(error.statusCode).end()
    }
}

const createPermissions = (req, res) => {
    const fileId = req.params.id
    const userId = req.headers.id

    if (!userId)
        return res.status(400).json({error: "user id required"})

    try {
        PermissionsService.createPermission(fileId, req.body, userId)
        return res.status(201)
    } catch (error) {
        return res.status(error.statusCode).end()
    }
}

const updatePermisssion = (req, res) => {
    
}

const deletePermission = (req, res) => {
    
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

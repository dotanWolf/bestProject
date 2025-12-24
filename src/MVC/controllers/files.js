const files = require('../models/files')
const client = require('../client')
const net = require('net')
const crypto = require('crypto')
const { stat } = require('fs')

// no input, GET request
const getAllEntries = (req, res) => {
    return res.status(200).json(files.getDirectoryContent('/'))
}

const validateRequest = (req) => {
    const userid = req.headers.id
    if (!userid)
        return 400
    const {name, location, type} = req.body
    if (!name || !location || !type) {
        return 400
    }
    if (type == "dir")
        return 200
    const content = req.body.content
    if (!content)
        return 400
    return 200
}

// gets a name, location, userid, type = {"file", "dir"}
// if the type is a file, also needs a content field
// saves the new entry under a uniuqe id through the cpp server
const createEntry = (req, res) => {
    // validate the request body and header
    const isRequestValid = validateRequest(req)
    if (isRequestValid !=200)
        // if not valid return 400
        return res.status(400).json({error: `entry fields missing`})
    // otherwise create a unique id
    const id = crypto.randomUUID()

    // create a json of the entry in memory
    const userid = req.headers.id
    const {name, location, type} = req.body
    var content
    if (type == "file") {
        content = req.body.content
    } else {
        content = null
    }
    const newEntry = files.createNewEntry(id, name, content, location, userid, type)

    // use the cpp server to create the file in disk
    const serverResponse = client.sendRequest("post " + id + " " + content + '\n')
    const status = serverResponse.split(' ')[0]
    return res.status(status).end()
}

const getEntry = (req, res) => {
    const file = files.getEntry(req.params.id)
    if (!file) {
        // id doesnt exist
       return res.status(404).json({error: "no entry with this id"})
    }
    return res.status(200).json(file)
}

// gets a name, location, userid, type = {"file", "dir"}
// if the type is a file, also needs a content field
// also gets the entries id in the request parameter
// if an entry exists with the given id, it deletes it
// and saves a new entry with the new parameters in the cpp server
// under the same id
const updateEntry = (req, res) => {
    // otherwise get the id provided
    const id = req.params.id
    // check if updating is even possible
    const oldEntry = files.getEntry(id)
    if (!oldEntry)
        return res.status(404).json({ error: 'entry not found' })

    // validate the request body and header
    const isRequestValid = validateRequest(req)
    if (isRequestValid !=200)
        // if not valid return 400
        return res.status(400).json({error: `entry fields missing`})

    // try to change the json in memory to the new fields
    const userid = req.headers.id
    const {name, location, type} = req.body
    var content
    if (type == "file") {
        content = req.body.content
    } else {
        content = null
    }
    const newEntry = files.updateEntry(id, name, content, location, userid, type)

    const oldType = oldEntry.type
    if (oldType == "file") {
        const serverResponse = client.sendRequest("delete" + " " + id + '\n')
        const status = serverResponse.split(' ')[0]
        if (status != 204)
            return res.status(500).json({error: "server error"})
    }
    
    if (type == "file") {
        const serverResponse = client.sendRequest("post" + " " + id + " " + content + '\n')
        const status = serverResponse.split(' ')[0]
        if (status != 201)
            return res.status(500).json({error: "server error"})
        return res.status(200).end() 
    }
}

const deleteEntry = (req, res) => {
    const id = req.headers.id
    // check if updating is even possible
    const oldEntry = files.getEntry(id)
    if (!oldEntry)
        return res.status(404).json({ error: 'entry not found' })
    files.deleteEntry(id)

    if (oldEntry.type == "file") {
        const serverResponse = client.sendRequest("delete" + " " + id + '\n')
        const status = serverResponse.split(' ')[0]
        if (status != 204)
            return res.status(500).json({error: "server error"})  
    }
    return res.status(204).end()
}

const getPermissions = (req, res) => {
    const id = req.params.id
    return res.status(200).json(files.getPermissions(id))
}

const createPermissions = (req, res) => {
    const id = req.params.id
    const permissions = files.createPermissions(id, req.body)
    if (!permissions) {
        return res.status(404).json({error: "entry not found"})
    }
    return res.status(201).json(permissions)
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

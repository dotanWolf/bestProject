const files = require('../models/files')
const net = require('net')
const crypto = require('crypto')
const { getegid } = require('process')

// no input, GET request
const getAllEntries = (req, res) => {
    return res.status(200).json(files.getDirectoryContent('/'))
}

// gets a name, location, userid, type = {"file", "dir"}
// if the type is a file, also needs a content field
// saves the new entry under a uniuqe id through the cpp server
const createEntry = (req, res) => {
    // for now we dont check if this user id actually exists and is signed in
    // we treat it as such
    const userid = req.headers.id
    const {name, location, type} = req.body

    if (!name) {
        return res.status(400).json({ error: 'entry name required' })
    }
    if (!location) {
        return res.status(400).json({ error: 'entry location required' })
    }
    if (!type) {
        return res.status(400).json({ error: 'entry type required' })
    }
    var content
    if (type == "file") {
        content = req.body.content
        if (!content)
            return res.status(400).json({ error: 'entry content required' })
    } else {
        content = null
    }
    const id = crypto.randomUUID()

    
    const newEntry = files.createNewEntry(id, name, content, location, userid, type)

    // establish a tcp connection with the server
    serverip = "127.0.0.1"
    serverport = 9120
    const client = new net.Socket();
    client.connect(serverport, serverip, () => {
        //console.log("connection was succesful")
    })

    const serverRequest = "post " + id + " " + content + '\n'
    client.write(serverRequest)
    
    client.on('data', (data) => {
        const response = data.toString().trim()
        const status = parseInt(response.split(' ')[0])
        res.status(status).end()
    });
}

const getEntry = (req, res) => {
    const file = files.getEntry(req.params.id)
    if (!file) {
        // id doesnt exist
       return res.status(404).json({error: "no entry with this id"})
    }
    return res.status(200).json(file)
}

const validateEntryFields = (fileds) => {
    const {name, location, type} = req.body
    if (!name) {
        return "name"
    }
    if (!location) {
        return "location"
    }
    if (!type) {
        return "type"
    }
    return ""
}

// gets a name, location, userid, type = {"file", "dir"}
// if the type is a file, also needs a content field
// also gets the entries id in the request parameter
// if an entry exists with the given id, it deletes it
// and saves a new entry with the new parameters in the cpp server
// under the same id
const updateEntry = (req, res) => {
    const id = req.params.id
    const userid = req.headers.id
    const isValid = validateEntryFields(req.body)
    if (isValid != "")
        return res.status(400).json({error: `entry ${isValid} required`})
    var content
    if (type == "file") {
        content = req.body.content
        if (!content)
            return res.status(400).json({ error: 'entry content required' })
    } else {
        content = null
    }
    const newEntry = files.updateEntry(id, name, content, location, userid, type)
    if (!newEntry)
        return res.status(404).json({ error: 'file not found' })

    if (type == "file") {
            // establish a tcp connection with the server
        serverip = "127.0.0.1"
        serverport = 9120
        const client = new net.Socket();
        client.connect(serverport, serverip, () => {
        //console.log("connection was succesful")
        })

        var serverRequest = "delete " + id  + '\n'
        client.write(serverRequest)
        serverRequest = "post" + id + " " + content + '\n'
        client.write(serverRequest)
        var status
        client.on('data', (data) => {
            const response = data.toString().trim()
            status = parseInt(response.split(' ')[0])
        });
        return res.status(status).end()
    }


}

const deleteEntry = (req, res) => {
    const id = req.headers.id
    const deletedEntry = deleteEntry(id)
    if (!deletedEntry) {
        // entry doesnt exist didnt delete
        return res.status(404).json({error: "file not found"})
    }
    if (deletedEntry.type == "file") {
        // this file was saved in the cpp server under id
        // needs to be deleted there also

        serverip = "127.0.0.1"
        serverport = 9120
        const client = new net.Socket();
        client.connect(serverport, serverip, () => {
        //console.log("connection was succesful")
        })

        const serverRequest = "delete " + id  + '\n'
        client.write(serverRequest)
        var status
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

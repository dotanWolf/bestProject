const files = require('../models/files')
const net = require('net')

// no input, GET request
const getAllEntries = (req, res) => {
    return res.status(200).json(files.getDirectoryContent('/'))
}

// gets a name, location, userid, type = {"file", "dir"}
// if the type is a file, also needs a content field
// saves the new entry under a uniuqe id through the cpp server
const createFileOrDirectory = (req, res) => {
    // for now we dont check if this user id actually exists and is signed in
    // we treat it as such
    const userid = req.headers.id
    const {name, location, type} = req.body
    const id = createId(userid, name, location)
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

const getFileOrDirectory = (req, res) => {
    const file = files.getFileOrDirectory(req.params.id)
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
const updateFileContent = (req, res) => {
    const id = req.params.id
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
    const newEntry = files.updateFile(id, name, content, location, userid, type)
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

        const serverRequest = "delete " + id  + '\n'
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

const deleteFile = (req, res) => {
    const id = params.headers.id
    const deletedEntry = deleteFile(id)
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

const getFilePermissions = (req, res) => {

}

const updateFilePermissions = (req, res) => {
    
}

const updatePermisssion = (req, res) => {
    
}

const deletePermission = (req, res) => {
    
}
module.exports = {
    getAllEntries,
    createFileOrDirectory,
    getFileOrDirectory,
    updateFileContent,
    deleteFile,
    getFilePermissions,
    updateFilePermissions,
    updatePermisssion,
    deletePermission
}

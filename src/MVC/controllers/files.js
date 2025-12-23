const files = require('../models/files')
const net = require('net')

const getAllFiles = (req, res) => {
    const files = files.getDirectoryContent('/')
    return res.status(200).json(files)
}

const createFileOrDirectory = (req, res) => {
    // for now we dont check if this user id actually exists and is signed in
    // we treat it as such
    const userid = req.headers.id
    const {name, content, location} = req.body
    if (!name || !content) {
        return res.status(400).json({ error: 'file data required' })
    }
    newFile = files.createNewFile(name, content, location, userid)

    // establish a tcp connection with the server
    serverip = "127.0.0.1"
    serverport = 9120
    const client = new net.Socket();
    client.connect(serverport, serverip, () => {
        //console.log("connection was succesful")
    })

    const serverRequest = "post " + name + " " + content + '\n'
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
       return res.status(404).json({error: "id doesnt exist"})
    } 
    return res.status(200)
}

const updateFileContent = (req, res) => {
    const id = params.headers.id
    const {name, content, location, userid, type} = params.body
    if (!name || !content || !location || !userid || !type)
        return res.status(400).json({ error: 'file data required' })

    const newFile = files.updateFile(id, name, content, location, userid, type)
    if (!newFile)
        return res.status(404).json({ error: 'file not found' })
    return res.status(200).json(newFile)
}

const deleteFile = (req, res) => {
    const id = params.headers.id
    const status = deleteFile(id)
    if (!status) {
        return res.status(404).json({error: "file not found"})
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
    getAllFiles,
    createFileOrDirectory,
    getFileOrDirectory,
    updateFileContent,
    deleteFile,
    getFilePermissions,
    updateFilePermissions,
    updatePermisssion,
    deletePermission
}

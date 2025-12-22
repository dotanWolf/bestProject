const files = require('../models/files')
const net = require('net')

const getAllFiles = (req, res) => {
    
}

const createFileOrDirectory = (req, res) => {
    // for now we dont check if this user id actually exists and is signed in
    // we treat it as such
    const userid = req.headers.id
    const {name, content} = req.body
    if (!name || !content) {
        return res.status(400).json({ error: 'file data required' })
    }
    newFile = files.createNewFile(name, content)

    // establish a tcp connection with the server
    serverip = "127.0.0.1"
    serverport = 9120
    const client = new net.Socket();
    client.connect(serverport, serverip, () => {
        //console.log("connection was succesful")
    })

    const serverRequest = "post " + name + " " + content + '\n'
    console.log(serverRequest)
    client.write(serverRequest)
    
    client.on('data', (data) => {
        const response = data.toString().trim()
        const status = parseInt(response.split(' ')[0])
        res.status(status).end()
    });
}

const getFileContent = (req, res) => {
}

const updateFileContent = (req, res) => {
}

const deleteFile = (req, res) => {
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
    getFileContent,
    updateFileContent,
    deleteFile,
    getFilePermissions,
    updateFilePermissions,
    updatePermisssion,
    deletePermission
}

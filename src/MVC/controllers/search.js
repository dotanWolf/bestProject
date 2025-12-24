const files = require('../models/files')
const net = require('net')
const FileService = require('../services/FileService')
const Client = require('../Client')

const searchFiles = (req, res) => {
    const query = req.params.query
    const entriesWithMatchingName = FileService.searchByName(query)

    // establish a tcp connection with the server
    

    listOfIds = Client.searchFiles(query).listOfIds

    const listOfEntries = listOfIds.map(id => {
        files.getEntry(id)
    }).filter(boolean)
    const entriesWithMatchingContent = listOfEntries.filter(
        entry => entry.content.includes(query)
    )
    const results = [...new Set([...entriesWithMatchingContent, ...entriesWithMatchingName])];
    return res.status(200).json(results)
}


module.exports = {
    searchFiles
}
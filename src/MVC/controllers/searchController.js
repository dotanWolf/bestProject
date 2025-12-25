const files = require('../models/Entry')
const FileService = require('../services/FileService')
const Client = require('../Client')
const FileRepository = require('../repositeries/FileRepositery'

)
const searchFiles = (req, res) => {
    const query = req.params.query
    const entriesWithMatchingName = FileRepository.searchByName(query)

    // establish a tcp connection with the server
    const {listOfIds, success} = Client.searchFiles(query)
    if(!success) {
        return res.status(500).json({error: "couldnt search files in the cpp server"})
    }

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
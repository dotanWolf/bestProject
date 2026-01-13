const files = require('../models/Entry')
const FileService = require('../services/FileService')
const Client = require('../client')
const FileRepository = require('../repositeries/FileRepositery')

const searchFiles = async (req, res) => {
    const userId = req.user.userId
    if (!userId) {
        return res.status(400).json({ error: "user id required" })
    }
    const query = req.params.query
    const entriesWithMatchingName = FileRepository.searchByName(query)

    // establish a tcp connection with the server
    const { listOfIds, success } = await Client.searchFiles(query)
    if (!success) {
        return res.status(500).json({ error: "couldnt search files in the cpp server" })
    }

    const listOfEntries = listOfIds.map(id => FileRepository.findById(id)).filter(Boolean)
    const entriesWithMatchingContent = listOfEntries.filter(
        entry => entry.content.includes(query)
    )
    var results = [...entriesWithMatchingContent, ...entriesWithMatchingName];
    const resultMap = new Map();
    results.forEach(file => resultMap.set(file.id, file))
    results = Array.from(resultMap.values());

    const userCanSee = results.filter(file => FileService.hasReadAccess(file, userId))
    return res.status(200).json(userCanSee)
}


module.exports = {
    searchFiles
}
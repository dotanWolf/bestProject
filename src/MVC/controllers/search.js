const files = require('../models/files')
const net = require('net')

const searchFiles = (req, res) => {
    const query = req.params.query
    const entriesWithMatchingName = files.searchEntryNames(query)

    // establish a tcp connection with the server
    serverip = "127.0.0.1"
    serverport = 9120
    const client = new net.Socket();
    client.connect(serverport, serverip, () => {
        //console.log("connection was succesful")
    })
    
    const serverRequest = "search " + query + '\n'
    client.write(serverRequest)

    var response
    client.on('data', (data) => {
        response = data.toString()
    });
    listOfIds = convertResponseToList(response)

    const listOfEntries = listOfIds.map(id => {
        files.getEntry(id)
    }).filter(boolean)
    const entriesWithMatchingContent = listOfEntries.filter(
        entry => entry.content.includes(query)
    )
    const results = [...new Set([...entriesWithMatchingContent, ...entriesWithMatchingName])];
    return res.status(200).json(results)
}

const convertResponseToList = (response) => {
    const status = response.split(' ')[0]
    if (status != 200) {
        return status
    }
    const parts = data.split('\n\n');
    const body = parts[1].trim();

    return body.split(' ');
}

module.exports = {
    searchFiles
}
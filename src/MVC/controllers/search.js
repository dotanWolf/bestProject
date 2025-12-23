const searchFiles = (req, res) => {
    // establish a tcp connection with the server
        serverip = "127.0.0.1"
        serverport = 9120
        const client = new net.Socket();
        client.connect(serverport, serverip, () => {
            //console.log("connection was succesful")
        })
    
        const serverRequest = "search " + query +   '\n'
        client.write(serverRequest)
        
        client.on('data', (data) => {
            const response = data.toString().trim()
            const status = parseInt(response.split(' ')[0])
            res.status(status).end()
        });
}

module.exports = {
    searchFiles
}
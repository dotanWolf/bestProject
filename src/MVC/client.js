const net = require('net');

const sendRequest = (request) => {
    return new Promise((resolve, reject) => {
        const serverip = "127.0.0.1";
        const serverport = 9120;
        
        const client = new net.Socket();

        // Set a timeout so web server doesn't hang forever if C++ crashes
        client.setTimeout(5000);

        client.connect(serverport, serverip, () => {
            client.write(request);
        });

        client.on('data', (data) => {
            const response = data.toString().trim();
            client.destroy(); // Kill the connection after getting the data
            resolve(response); // This "returns" the value to whoever called sendRequest
        });
    });
};

module.exports = {
    sendRequest
}
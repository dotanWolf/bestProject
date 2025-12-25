const net = require('net');

class Client {
    constructor() {
        this.serverip = "127.0.0.1";
        this.serverport = 9120;
        this.timeout = 5000; // 5 seconds timeout
    }

    async sendRequest(command) {
        const port = this.serverport;
        const ip = this.serverip;
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            // Set a timeout so web server doesn't hang forever if C++ crashes
            client.setTimeout(5000);

            client.connect(port, ip, () => {
                client.write(command);
            });

            client.on('data', (data) => {
                const response = data.toString().trim();
                client.destroy();
                resolve(response);
            });

            client.on('error', (err) => {
                client.destroy();
                reject(err);
            });

            // client.on('timeout', () => {
            //     client.destroy();
            //     const error = new Error("C++ Server Timeout")
            //     error.statusCode = 600
            //     reject(error);
            // });
        });
    }

    async saveFile(fileId, content) {
        const command = `post ${fileId} ${content}\n`;
        const response = await this.sendRequest(command);
        const status = parseInt(response.split(' ')[0]);

        return { status, success: status === 201 };
    }

    /**
     * Retrieve a file from Assignment 2 server
     * @param {string} fileId - File ID
     * @returns {Promise<Object>} Response with status and content
     */
    async getFile(fileId) {
        const command = `get ${fileId}\n`;
        const response = await this.sendRequest(command);
        const parts = response.split(' ');
        const status = parseInt(parts[0]);
        const content = parts.slice(1).join(' ');
        return { status, content, success: status === 200 };
    }

    /**
     * Update a file in Assignment 2 server
     * @param {string} fileId - File ID
     * @param {string} content - New content
     * @returns {Promise<Object>} Response with status
     */
    async updateFile(fileId, content) {
        // First delete, then create
        await this.deleteFile(fileId);
        return await this.saveFile(fileId, content);
    }

    /**
     * Delete a file from Assignment 2 server
     * @param {string} fileId - File ID
     * @returns {Promise<Object>} Response with status
     */
    async deleteFile(fileId) {
        const command = `delete ${fileId}\n`;
        const response = await this.sendRequest(command);
        const status = parseInt(response.split(' ')[0]);

        return { status, success: status === 204 };
    }

    /**
     * Search for content in files on Assignment 2 server
     * @param {string} query - Search query
     * @returns {Promise<Object>} Response with status and results
     */
    async searchFiles(query) {
        const command = `search ${query}\n`;
        const response = await this.sendRequest(command);
        const status = response.split(' ')[0]
        const parts = data.split('\n\n');
        const body = parts[1].trim();
        const listOfIds = body.split(' ')
        return { status, listOfIds, success: status === 200 };
    }
}

module.exports = new Client();
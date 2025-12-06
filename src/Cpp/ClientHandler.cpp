#include "ClientHandler.h"
#include <cstring>
#include <sstream>
#include "Parser.h"
#include <algorithm>

using namespace std;

std::string ClientHandler::processCommand(const std::string& commandLine) {
    // 1. Setup & Identification (Remains clean)
    string tempCommandLine = commandLine;
    string commandName = Parser::getFirstWord(tempCommandLine);
    if (commandName.empty()) { return "400 Bad Request\n"; }
    transform(commandName.begin(), commandName.end(), commandName.begin(), ::toupper);
    
    auto it = app.commands.find(commandName);
    if (it == app.commands.end() || it->second == nullptr) { return "400 Bad Request\n"; }
    ICommand* cmd = it->second;

    stringstream outputStream;
    string responsePrefix;
    
    try {
        // Validation
        auto arguments = cmd->isValid(commandLine);
        if (!arguments || arguments->empty()) {
            responsePrefix = "400 Bad Request\n";
        } else {
            cmd->execute(arguments, outputStream); 
            
            // 3. Response Formatting
            if (commandName == "POST") { responsePrefix = "201 Created\n"; } 
            else if (commandName == "DELETE") { responsePrefix = "204 No Content\n"; } 
            else if (commandName == "GET" || commandName == "SEARCH") { 
                responsePrefix = "200 Ok\n\n"; // 200 Ok + two newlines
            }
        }
    } catch (const exception& e) {
        // Error Handling
        if (string(e.what()).find("Not Found") != string::npos) {
            responsePrefix = "404 Not Found\n";
        } else {
            responsePrefix = "400 Bad Request\n";
        }
    } catch (...) {
        responsePrefix = "400 Bad Request\n";
    }

    // 4. Return Final Response
    return responsePrefix + outputStream.str(); // Concatenate prefix + captured output
}
void ClientHandler::run() {
    char buffer[4096];
    const int expected_data_len = sizeof(buffer);
    
    std::cout << "Client handler thread started for socket " << clientSock << std::endl;

    while (true) {
        // Clear buffer before receiving data
        memset(buffer, 0, expected_data_len);
        
        // Read client request (command line ending in \n)
        int read_bytes = recv(clientSock, buffer, expected_data_len - 1, 0);
        
        if (read_bytes == 0) {
            // Connection closed by client
            std::cout << "Client disconnected on socket " << clientSock << std::endl;
            close(clientSock);
            break;
        } else if (read_bytes < 0) {
            perror("recv error");
            close(clientSock);
            break;
        } else {
            // Null-terminate the received data
            buffer[read_bytes] = '\0';
            std::string commandLine(buffer);
            
            // Process command and get the response string
            std::string response = processCommand(commandLine); 
            
            if (response.back() != '\n') {
                 response += "\n";
            }
            
            // Send the response back to the client
            int sent_bytes = send(clientSock, response.c_str(), response.length(), 0);
            if (sent_bytes < 0) {
                perror("send error");
            }
        }
    }
}
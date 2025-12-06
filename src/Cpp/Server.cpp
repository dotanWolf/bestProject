#include <string> 
#include <iostream>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>
#include <sstream>     
#include <fstream>      
#include <cstdio>       
#include <cstdlib>      
#include "Server.h"
#include "App.h"
#include "IExecutor.h"
#include "output.h"     

// The constructor accepts IExecutor* to satisfy Dependency Injection.
Server::Server(int port, App& app, IExecutor* executor)
    : port(port), app(app), executor(executor) {}
    

int Server::CreateSocket() {
    // Create a TCP/IP socket (AF_INET, SOCK_STREAM)
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return -1;
    }
    std::cout << "Socket created" << std::endl;
    return sock;
}

struct sockaddr_in Server::CreateServerAddress() {
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    // Listen on any available network interface
    sin.sin_addr.s_addr = INADDR_ANY;
    // Convert port number to network byte order
    sin.sin_port = htons(port);
    return sin;
}


void Server::HandleClient(int client_sock) {
    char buffer[4096];
    
    // The server handles multiple commands over the same persistent TCP connection.
    while (true) {
        
        // 1. Read the command from the socket manually (blocking call)
        // We use recv to get the raw bytes sent by the client.
        int read_bytes = recv(client_sock, buffer, sizeof(buffer) - 1, 0);
        
        if (read_bytes <= 0) {
            // Connection closed (read_bytes == 0) or error (read_bytes < 0)
            break; 
        }
        
        // Null-terminate the buffer and create a C++ string
        buffer[read_bytes] = '\0';
        std::string client_command(buffer);
        
        // 2. Prepare the I/O streams for the App using stringstream (portable abstraction)
        // This decouples the App from the socket by treating the command as a string input.
        std::istringstream iss(client_command); 
        std::ostringstream oss; 
        
        // 3. Set the thread-local stream to the stringstream
        // All calls to printOutput() in the App/Commands will write to 'oss'.
        setThreadOutputStream(&oss); 

        // 4. Execute the command using the App logic
        try {
            // App reads input from the stringstream 'iss'
            app.executeSingleCommand(iss, oss); 
        } catch (const std::exception& e) {
            std::cerr << "Exception during command execution: " << e.what() << std::endl;
        } catch (...) {
            std::cerr << "Unknown exception during command execution." << std::endl;
        }

        // 5. Send the App's output back to the client manually
        std::string response = oss.str();
        
        // Ensure response ends with a newline as required
        if (response.empty() || response.back() != '\n') { 
            response += "\n";
        }
        
        // Send the complete response back to the client
        send(client_sock, response.c_str(), response.length(), 0);

        // Reset the stream for the next potential command (though new input will overwrite)
        memset(buffer, 0, sizeof(buffer));
    }
    
    
    setThreadOutputStream(&std::cout);
    close(client_sock);
 
}


bool Server::createThreadForNewUser() {
    // Placeholder implementation
    return false;
} 

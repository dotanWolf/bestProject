#include <string> 
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <map>
#include <netdb.h>      // For gethostbyname and struct hostent
#include <sys/types.h>
#include <cstdlib>
#include <stdexcept>
#include <cstring>      // For memset
#include <algorithm>
#include "RLECompressor.h"
#include "ICommand.h"
#include "addCommand.h"
#include "PostCommand.h" 
#include "getCommand.h"
#include "searchCommand.h"
#include "DeleteCommand.h"
#include "App.h"
#include "ICompressor.h"
#include "Server.h"
#include "ThreadExecutor.h" 
#include "input.h"      

using namespace std;

void runClient(const char* ip_address, int port_no); 

int main(int argc, char* argv[]) {
    
    
    if (argc < 2 || argc > 3) {
        cerr << "Usage (Server): " << argv[0] << " <port_number>" << endl;
        cerr << "Usage (Client): " << argv[0] << " <server_ip> <server_port>" << endl;
        return 1;
    }
    
    if (argc == 3) {
        const char* ip_address = argv[1];
        int port_no;

        try {
            // Port is correctly read from argv[2]
            port_no = std::stoi(argv[2]); 
        } catch (const std::exception& e) {
            cerr << "Client Error: Invalid port number: " << argv[2] << endl;
            return 1;
        }

        // Delegate execution to the client function
        runClient(ip_address, port_no);
        return 0; 
    }

   
    // 1. Command and Application Initialization
    map<string, ICommand*> commands;
    ICompressor* compressor = new RLECompressor();

    ICommand* post = new addCommand();
    commands["POST"] = post; 
    ICommand* get = new getCommand();
    commands["GET"] = get;
    ICommand* search = new searchCommand();
    commands["SEARCH"] = search;
    ICommand* deleteC = new DeleteCommand();
    commands["DELETE"] = deleteC;

    App app(commands, compressor);
    
    // Set up port number (correctly reads from argv[1])
    int port;
    try {
        port = stoi(argv[1]); 
    } catch (const std::exception& e) {
        cerr << "Server Error: Invalid port number: " << argv[1] << endl;
        for (auto const& [key, val] : commands) { delete val; }
        delete compressor;
        return 1;
    }

    // 2. Server Setup 
    IExecutor* executor = new ThreadExecutor();
    Server server(port, app, executor); 

    // 3. Socket Creation, Bind, and Listen 
    int sock = server.CreateSocket();
    if (sock < 0) { delete executor; return 1; }

    if (!server.bindSocket(sock)) {
        close(sock); delete executor; return 1;
    }

    if (listen(sock, 5) < 0) {
        perror("error listening to a socket");
        close(sock); delete executor; return 1;
    }
    
    cout << "Server listening on port " << port << "..." << endl;

    // 4. Main Server Loop: Accept and Delegate
    while(true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        
        int client_sock = accept(sock,  (struct sockaddr *) &client_sin,  &addr_len);
        
        if (client_sock < 0) {
            perror("error accepting client");
            continue; 
        }
        
        server.executeClientTask(client_sock);
    }
    
    // Cleanup (only reached on unexpected loop exit)
    for (auto const& [key, val] : commands) { delete val; }
    delete compressor;
    delete executor; 
    close(sock);
    
    return 0; 
}



void runClient(const char* ip_address, int port_no) {
    
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return; 
    }
    
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_port = htons(port_no);
    struct hostent* server_host = gethostbyname(ip_address);
    memcpy(&sin.sin_addr, server_host->h_addr, server_host->h_length);

    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error connecting to server");
        close(sock);
        return;
    }
    
    cout << "Connected to server. Enter commands:" << endl;

    while (true) {
        string userInput = getInputFromStream(cin);
        
        if (userInput.empty()) {
            continue;
        }

        // Ensure the command ends with the required newline protocol character
        if (userInput.back() != '\n') {
            userInput += "\n";
        }
        
        int data_len = userInput.length(); 
        
        // Send the message
        int sent_bytes = send(sock, userInput.c_str(), data_len, 0);

        if (sent_bytes < 0) {
            perror("send error");
            break;
        }

        char buffer[4096];
        int expected_data_len = sizeof(buffer);
        
        // Recieve message from server
        // NOTE: This basic recv() only reads the first chunk of data.
        int read_bytes = recv(sock, buffer, expected_data_len - 1, 0);
        
        if (read_bytes == 0) {
            cout << "Connection closed by server." << endl;
            break;
        }
        else if (read_bytes < 0) {
            perror("recv error");
            break;
        }
        else {
            buffer[read_bytes] = '\0'; 
            cout << buffer; 
        }
    }
    
    close(sock);
}
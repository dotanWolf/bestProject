#include <string> 
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <map>
#include <cstdlib>
#include <stdexcept>

// Application Core
#include "App.h"
#include "ICompressor.h"
#include "RLECompressor.h"

// Command Pattern
#include "ICommand.h"
#include "addCommand.h" 
#include "getCommand.h"
#include "searchCommand.h"
#include "DeleteCommand.h"
#include "PostCommand.h"

// Server/Threading
#include "Server.h"
#include "IExecutor.h"
#include "ThreadPerClientExecutor.h"
#include "ThreadPoolExecutor.h"
#include <mutex>

using namespace std;

// The server's entry point and main execution loop.
std::mutex m;

int main(int argc, char* argv[]) {
    static std::mutex file_mutex; // shared between all threads
    if (argc != 2) {
        //cerr << "Usage: " << argv[0] << " <PortNumber>" << endl;
        return 1;
    }

    map<string, ICommand*> commands;
    
    // 1. Initialize Compressor
    ICompressor* compressor = new RLECompressor();

    // Note: The 'add' command from Ex1 is renamed to 'POST' for Ex2
    ICommand* post = new addCommand(); 
    commands["POST"] = post; 
    ICommand* get = new getCommand();
    commands["GET"] = get;
    ICommand* search = new searchCommand();
    commands["SEARCH"] = search;
    ICommand* deleteC = new DeleteCommand();
    commands["DELETE"] = deleteC;
    std::mutex serverLock;
    // 3. Initialize App (The Command Processor)
    App app(commands, compressor, &serverLock);
    int port;
    try {
        port = stoi(argv[1]);
    } catch (const invalid_argument& e) {
        //cerr << "Invalid port number." << endl;
        return 1;
    }

    //IExecutor* executor = new ThreadPerClientExecutor(); 
    size_t poolSize = 0;

    const char* envThread = std::getenv("THREAD_POOL_SIZE");
    if (envThread != nullptr) {
        poolSize = std::stoul(envThread);
    } else {
        poolSize = std::thread::hardware_concurrency();
    }

    IExecutor* executor = new ThreadPoolExecutor(poolSize); 
    Server* server = new Server(port, app, executor); 

    // Network Setup 
    int sock = server->CreateSocket();
    if (sock < 0) {
        // Error already printed by CreateSocket's perror
        delete server;
        delete executor;
        return 1;
    }
    
    struct sockaddr_in sin = server->CreateServerAddress();
    
    // Bind the socket to the address and port
    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        //perror("error binding socket");
        close(sock);
        delete server;
        delete executor;
        return 1;
    }

    if (listen(sock, SOMAXCONN) < 0) {
        //perror("error listening to a socket");
        close(sock);
        delete server;
        delete executor;
        return 1;
    }
     while(true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        
        // Wait for a client connection request
        int client_sock = accept(sock, (struct sockaddr *) &client_sin, &addr_len);
        if (client_sock < 0) {
            //perror("error accepting client");
            continue;
        }
        
        // Print client connection info (optional, for debugging/status)
        char client_ip[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &(client_sin.sin_addr), client_ip, INET_ADDRSTRLEN);
        //cout << "Client connected from " << client_ip << ":" << ntohs(client_sin.sin_port) << endl;
        // Create a task (lambda function) to handle the connected client
        // Capture 'server' (pointer to Server) and 'client_sock' by value.
        IExecutor::Runnable clientTask = [server, client_sock]() {
            server->HandleClient(client_sock);
        };

        // run the task to the executor, which will create a new thread for it.
        executor->execute(clientTask); 
    }
    
    // Delete commands
    for (const auto& pair : commands) {
        delete pair.second;
    }
    delete compressor;
    
    // Delete network components
    close(sock);
    delete server;
    delete executor;
    
    return 0;
}
#include <string> 
#include <iostream>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>
#include <stdexcept>
#include "output.h"
#include "Server.h"
#include "ClientHandler.h" // Dependency for the concrete Runnable

using namespace std;

// Constructor now accepts IExecutor* to achieve Dependency Inversion
Server::Server(int port, const App& app, IExecutor* exec)
    : port(port), app(app), executor(exec)  
{
}

int Server::CreateSocket() {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return -1;
    }
    return sock;
}

struct sockaddr_in Server::CreateServerAddress() {
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    // INADDR_ANY binds the socket to all available interfaces
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);
    return sin;
}

bool Server::bindSocket(int sock) {
    sockaddr_in addr = CreateServerAddress();

    if (bind(sock, (struct sockaddr*)&addr, sizeof(addr)) < 0) {
        perror("bind failed");
        return false;
    }

    return true;
}

// This method takes the accepted socket and delegates the work to the Executor.
bool Server::executeClientTask(int clientSock) {
    if (clientSock < 0 || !executor) {
        printOutput(std::cerr,"Invalid client socket or executor is null.");
        // If the executor is null, the system is misconfigured, but we still close the socket.
        if (clientSock >= 0) {
            close(clientSock);
        }
        return false;
    }

    Runnable* handler = new ClientHandler(clientSock, app); 

    // 2. Delegate the execution to the IExecutor
    // The executor is responsible for managing the thread and deleting the handler.
    try {
        executor->execute(handler);
        return true;
    } catch (const std::exception& e) {
        std::cerr << "Executor failed to execute task: " << e.what() << std::endl;
        // Clean up resources if execution fails before the executor can handle it
        close(clientSock);
        delete handler;
        return false;
    }
}
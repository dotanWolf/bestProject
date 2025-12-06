#ifndef CLIENT_HANDLER_H
#define CLIENT_HANDLER_H

#include "Runnable.h"
#include "App.h"
#include <unistd.h>
#include <iostream>
#include <string>
#include <sys/socket.h>

class ClientHandler : public Runnable {
private:
    int clientSock;
    App& app; 

    // Helper to process the command and get the response
    std::string processCommand(const std::string& commandLine);

public:
    ClientHandler(int sock, App& sharedApp) : clientSock(sock), app(sharedApp) {}
    void run() override; 
};

#endif
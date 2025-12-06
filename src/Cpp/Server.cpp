#include <string> 
#include <iostream>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>
#include "Server.h"


Server::Server(int port, const App& app)
    : port(port), app(app)  
{
}
int Server::CreateSocket() {
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
    // puts a constant, which means we dont care which network card recieves the data
    // we want to get it
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);
    return sin;
}

// void Server:bindSocket() {

// }

bool Server::createThreadForNewUser() {
    return false;
}
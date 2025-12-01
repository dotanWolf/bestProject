#include <string> 
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <map>
#include "RLECompressor.h"
#include "ICommand.h"
#include "PostCommand.h"
#include <cstdlib>
#include "getCommand.h"
#include "searchCommand.h"
#include "App.h"
#include "ICompressor.h"
#include "DeleteCommand.h"
#include "Server.h"

using namespace std

int main(int argc, char* argv[]) {
    map<string, ICommand*> commands;
    //
    ICompressor* compressor = new RLECompressor();

    ICommand* post = new PostCommand();
    commands["add"] = add;
    ICommand* get = new getCommand();
    commands["get"] = get;
    ICommand* search = new searchCommand();
    commands["search"] = search;
    ICommand* deleteC = new DeleteCommand();
    commands["delete"] = deleteC;

    App app(commands, compressor);

    char* port = argv[1];
    Server server = new Server(stoi(port), app);

    int sock = server.CreateSocket();
    struct sockaddr_in sin = server.CreateServerAddress();
    // we bind these vaues to the socket so when someone sends to these values our socket gets the data
    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
    }

    // tells the socket we want at max 5 processes to wait for us
    // might need to change that
    if (listen(sock, 5) < 0) {
        perror("error listening to a socket");
    }
    while(true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        // we wait for a request from a clinet after that request comes
        // we  recieve a new socket specified only for that client 
        int client_sock = accept(sock,  (struct sockaddr *) &client_sin,  &addr_len);
        if (client_sock < 0) {
            perror("error accepting client");
        }
        // create a thread to handle the clients message while the main thread keeps

    }

    // thread starts here:
    while(true) {
        char buffer[4096];
        int expected_data_len = sizeof(buffer);
        // get data from the client
        int read_bytes = recv(client_sock, buffer, expected_data_len, 0);
        if (read_bytes == 0) {
        // connection is closed
            close(client_sock);
            break;
        }
        else if (read_bytes < 0) {
        // error
        }
        else {
            // create a string stream and pour the bytes until you get a \n char
            // then parse the entire thing based on the app.cpp functions
            server.getApp().run();
        }
    }
    
    
}
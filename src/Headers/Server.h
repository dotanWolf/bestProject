#ifndef SERVER_H
#define SERVER_H

#include "app.h"

class Server {
    private:
        App app;
        const int port
    public:
        Server(const int port, App app);
        int CreateSocket();
        struct sockaddr_in CreateServerAddress();
        // void bindSocket();
        // void createThreadForNewUser();

};

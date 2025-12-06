#ifndef SERVER_H
#define SERVER_H

#include "App.h"

class Server {
    private:
        App app;
        int port;
    public:
        Server( int port, const App& app);
        int CreateSocket();
        struct sockaddr_in CreateServerAddress();
        // void bindSocket();
        bool createThreadForNewUser();

};
#endif
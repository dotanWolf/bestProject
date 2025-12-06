#ifndef SERVER_H
#define SERVER_H

#include "App.h"
#include "IExecutor.h" // Include the new dependency
#include <sys/socket.h> 
#include <netinet/in.h> 

class Server {
    private:
        App app;
        int port;
        IExecutor* executor; // Server depends on the Executor interface

    public:
        // Constructor now accepts the IExecutor
        Server(int port, const App& app, IExecutor* exec);
        int CreateSocket();
        struct sockaddr_in CreateServerAddress();
        bool bindSocket(int sock);
        bool executeClientTask(int clientSock); 
};
#endif
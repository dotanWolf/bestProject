#ifndef SERVER_H
#define SERVER_H

#include "App.h"
#include "IExecutor.h"
#include <mutex>

class Server {
    private:
        App app;
        int port;
        IExecutor* executor;
        
    public:
        Server(int port, App& app, IExecutor* executor);
        int CreateSocket();
        struct sockaddr_in CreateServerAddress();
        // void bindSocket();
        bool createThreadForNewUser();
        void HandleClient(int client_sock);

};
#endif
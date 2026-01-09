#include "gtest/gtest.h"
#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include <map>
#include <mutex>

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>

#include "Server.h"
#include "App.h"
#include "ICommand.h"
#include "ICompressor.h"
#include "ThreadPerClientExecutor.h"
#include "RLECompressor.h"
#include "getCommand.h"
#include "addCommand.h"
#include "searchCommand.h"
#include "DeleteCommand.h"


using namespace std;

std::mutex g_testMutex; 
IExecutor* g_testExecutor = new ThreadPerClientExecutor();

TEST(ServerProtocolTest, SocketCreationValidation) {
    std::map<std::string, ICommand*> commands;
    ICompressor* compressor = new RLECompressor();

    App app(commands, compressor, &g_testMutex); 
    
    Server testServer(8080, app, g_testExecutor); 
    
    int resultSock = testServer.CreateSocket();
    EXPECT_GE(resultSock, 0);
    
    if (resultSock >= 0) {
        close(resultSock);
    }
}

TEST(ServerProtocolTest, BasicCommunication) {
    std::map<std::string, ICommand*> commands;
    ICompressor* compressor = new RLECompressor();
    std::mutex testMutex;
    ICommand* post = new addCommand(); 
    commands["POST"] = post; 
    ICommand* get = new getCommand();
    commands["GET"] = get;
    ICommand* search = new searchCommand();
    commands["SEARCH"] = search;
    ICommand* deleteC = new DeleteCommand();
    commands["DELETE"] = deleteC;

    App app(commands, compressor, &testMutex);
    Server server(9090, app, g_testExecutor);

    // Create server socket
    int serverSock = server.CreateSocket();
    ASSERT_GE(serverSock, 0);

    sockaddr_in addr = server.CreateServerAddress();
    ASSERT_GE(bind(serverSock, (sockaddr*)&addr, sizeof(addr)), 0);
    ASSERT_GE(listen(serverSock, 1), 0);

    // Start a thread that waits for a client connection
    std::thread serverThread([&]() {
        int clientSock = accept(serverSock, NULL, NULL);
        ASSERT_GE(clientSock, 0);
        server.HandleClient(clientSock);
    });

    // === Client side ===
    int clientSock = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_GE(clientSock, 0);

    // Connect client to the server
    ASSERT_GE(connect(clientSock, (sockaddr*)&addr, sizeof(addr)), 0);

    // Send a command to the server
    std::string command = "GET testfile\n";
    send(clientSock, command.c_str(), command.size(), 0);

    // Receive the server response
    char buffer[4096] = {0};
    int bytes = recv(clientSock, buffer, sizeof(buffer), 0);
    ASSERT_GT(bytes, 0);

    std::string response(buffer, bytes);

    // Expect OK status in response
    EXPECT_TRUE(response.find("404 Not Found") != std::string::npos);

    // Cleanup sockets
    close(clientSock);
    shutdown(serverSock, SHUT_RDWR);
    close(serverSock);

    // Wait for server thread to finish
    serverThread.join();
}


int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
#include "gtest/gtest.h"
#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include <map>
#include <mutex> // Required for std::mutex
#include "Server.h" 
#include "App.h" 
#include "ICommand.h"
#include "ICompressor.h" 
#include "ThreadPerClientExecutor.h" 
#include "RLECompressor.h"

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


int main(int argc, char** argv) {

    ::testing::InitGoogleTest(&argc, argv);
    int result = RUN_ALL_TESTS();
    
    // Cleanup the global executor object
    delete g_testExecutor;

    return result;
}
#include "gtest/gtest.h"
#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <thread>
#include <unistd.h> 
// Include all necessary headers
#include "Server.h" 
#include "ICommand.h"
#include "ThreadExecutor.h" // Need to include the concrete executor for the test

using namespace std;

App globalApp({}, nullptr); 
IExecutor* globalExecutor = new ThreadExecutor(); // Initialize once for tests

TEST(ServerProtocolTest, Validation){
    // FIX 3A: Use the new constructor signature
    Server testServer(8080, globalApp, globalExecutor); 
    
    int resultSock = testServer.CreateSocket();
    EXPECT_GE(resultSock, 0);
}

TEST(ServerProtocolTest, BindSocketSuccess) {
    Server server(8080, globalApp, globalExecutor);

    int sock = server.CreateSocket();
    ASSERT_GE(sock, 0);

    bool result = server.bindSocket(sock);
    EXPECT_TRUE(result);
    close(sock);
}


TEST(ServerProtocolTest, ExecuteClientTaskCallability) {
    Server testServer(8080, globalApp, globalExecutor);
    int dummy_sock = -1; 
    EXPECT_FALSE(testServer.executeClientTask(dummy_sock)); 
}

int main(int argc, char** argv) {
    testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
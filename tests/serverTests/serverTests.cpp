#include "gtest/gtest.h"
#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include "Server.h" 
#include "ICommand.h"

using namespace std;

TEST(ServerProtocolTest, Validation){
std::map<std::string, ICommand*> commands;
ICompressor* compressor = nullptr;

App app(commands, compressor);
    Server testServer(8080, app);
    int resultSock = testServer.CreateSocket();
    EXPECT_GE(resultSock, 0);
}

TEST(ServerProtocolTest, BindSocketSuccess) {
    std::map<std::string, ICommand*> commands;
    ICompressor* compressor = nullptr;
    App app(commands, compressor);

    Server server(8080, app);

    int sock = server.CreateSocket();
    ASSERT_GE(sock, 0);

    bool result = server.bindSocket(sock);
    EXPECT_TRUE(result);

    close(sock);
}

TEST(ServerProtocolTest, ThreadCreationSuccess) {
    std::map<std::string, ICommand*> commands;
    ICompressor* compressor = nullptr;

    App app(commands, compressor);
    Server testServer(8080, app);

    EXPECT_TRUE(testServer.createThreadForNewUser());
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add include directory
include_directories(Headers)


set(SERVER_SRCS
    Cpp/ServerMain.cpp
    Cpp/Server.cpp
    Cpp/ThreadPerClientExecutor.cpp
    Cpp/App.cpp
    Cpp/ICompressor.cpp
    Cpp/RLECompressor.cpp
    Cpp/ICommand.cpp
    Cpp/addCommand.cpp
    Cpp/getCommand.cpp
    Cpp/searchCommand.cpp
    Cpp/DeleteCommand.cpp
    Cpp/PostCommand.cpp
    Cpp/create.cpp
    Cpp/load.cpp
    Cpp/output.cpp
    Cpp/input.cpp
    Cpp/Parser.cpp
    Cpp/save.cpp
    Cpp/deleteFile.cpp
    Cpp/ThreadPoolExecutor.cpp
)

set(CLIENT_SRCS
    Cpp/Client.cpp
    Cpp/Client.py
    Cpp/ThreadPerClientExecutor.cpp
    Cpp/ThreadPoolExecutor.cpp
    Cpp/App.cpp
    Cpp/ICompressor.cpp
    Cpp/RLECompressor.cpp
    Cpp/ICommand.cpp
    Cpp/addCommand.cpp
    Cpp/getCommand.cpp
    Cpp/searchCommand.cpp
    Cpp/DeleteCommand.cpp
    Cpp/PostCommand.cpp
    Cpp/create.cpp
    Cpp/load.cpp
    Cpp/output.cpp
    Cpp/input.cpp
    Cpp/Parser.cpp
    Cpp/save.cpp
    Cpp/deleteFile.cpp
)

# MyProject is the server. 
add_executable(MyProject ${SERVER_SRCS})

# ClientApp is the client. 
add_executable(ClientApp ${CLIENT_SRCS})

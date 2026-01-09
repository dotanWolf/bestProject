cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add include directory
include_directories(src/Headers)


set(SERVER_SRCS
    src/Cpp/ServerMain.cpp
    src/Cpp/Server.cpp
    src/Cpp/ThreadPerClientExecutor.cpp
    src/Cpp/App.cpp
    src/Cpp/ICompressor.cpp
    src/Cpp/RLECompressor.cpp
    src/Cpp/ICommand.cpp
    src/Cpp/addCommand.cpp
    src/Cpp/getCommand.cpp
    src/Cpp/searchCommand.cpp
    src/Cpp/DeleteCommand.cpp
    src/Cpp/PostCommand.cpp
    src/Cpp/create.cpp
    src/Cpp/load.cpp
    src/Cpp/output.cpp
    src/Cpp/input.cpp
    src/Cpp/Parser.cpp
    src/Cpp/save.cpp
    src/Cpp/deleteFile.cpp
    src/Cpp/ThreadPoolExecutor.cpp
)

set(CLIENT_SRCS
    src/Cpp/Client.cpp
    src/Cpp/Client.py
    src/Cpp/ThreadPerClientExecutor.cpp
    src/Cpp/ThreadPoolExecutor.cpp
    src/Cpp/App.cpp
    src/Cpp/ICompressor.cpp
    src/Cpp/RLECompressor.cpp
    src/Cpp/ICommand.cpp
    src/Cpp/addCommand.cpp
    src/Cpp/getCommand.cpp
    src/Cpp/searchCommand.cpp
    src/Cpp/DeleteCommand.cpp
    src/Cpp/PostCommand.cpp
    src/Cpp/create.cpp
    src/Cpp/load.cpp
    src/Cpp/output.cpp
    src/Cpp/input.cpp
    src/Cpp/Parser.cpp
    src/Cpp/save.cpp
    src/Cpp/deleteFile.cpp
)

# MyProject is the server. 
add_executable(MyProject ${SERVER_SRCS})

# ClientApp is the client. 
add_executable(ClientApp ${CLIENT_SRCS})

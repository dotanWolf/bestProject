cmake_minimum_required(VERSION 3.10)
project(DeleteCommandTests)

# GoogleTest FetchContent
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
FetchContent_MakeAvailable(googletest)

enable_testing()

# Add include directory for headers
include_directories(${CMAKE_SOURCE_DIR}/../../src/Headers)

add_executable(rundeleteCommandTests
    deleteCommandTests.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/DeleteCommand.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/ICommand.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/create.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/save.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/input.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/output.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/Parser.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/RLECompressor.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/ICommand.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/deleteFile.cpp
)

target_link_libraries(rundeleteCommandTests gtest gtest_main)

add_test(NAME deleteCommandTests COMMAND rundeleteCommandTests)

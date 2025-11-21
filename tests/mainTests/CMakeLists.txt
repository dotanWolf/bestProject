cmake_minimum_required(VERSION 3.10)
project(fileCreationTests)

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

add_executable(runmainTests
    mainTests.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/parse.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/compress.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/create.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/save.cpp
)

target_link_libraries(runmainTests gtest gtest_main)

add_test(NAME mainTests COMMAND runmainTests)

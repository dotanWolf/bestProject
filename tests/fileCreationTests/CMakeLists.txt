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

add_executable(runFileCreationTests
    createTests.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/create.cpp
)

target_link_libraries(runFileCreationTests gtest gtest_main)

add_test(NAME fileCreationTests COMMAND runFileCreationTests)

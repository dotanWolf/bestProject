cmake_minimum_required(VERSION 3.10)
project(inputTests)

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

add_executable(inputTests
    inputTests.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/input.cpp
)

target_link_libraries(rundinputTests gtest gtest_main)

add_test(NAME inputTests COMMAND runinputTests)

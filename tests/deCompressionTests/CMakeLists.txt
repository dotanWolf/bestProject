cmake_minimum_required(VERSION 3.10)
project(decompressionTests)

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

add_executable(rundeCompressionTests
    deCompressionTests.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/RLECompressor.cpp
    ${CMAKE_SOURCE_DIR}/../../src/Cpp/ICommand.cpp

)

target_link_libraries(rundeCompressionTests gtest gtest_main)

add_test(NAME decompressionTests COMMAND rundeCompressionTests)

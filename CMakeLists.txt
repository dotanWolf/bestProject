cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Collect all .cpp files in src/CPP
file(GLOB_RECURSE SOURCES "src/CPP/*.cpp")

# Add include directory
include_directories(src/Headers)

# Create executable
add_executable(MyProject ${SOURCES})

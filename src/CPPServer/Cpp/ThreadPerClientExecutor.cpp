#include "ThreadPerClientExecutor.h"
#include <iostream>
#include <thread>

void ThreadPerClientExecutor::execute(IExecutor::Runnable command) {
    // Launch a new detached thread to execute the Runnable command (the client handler)
    std::thread t(std::move(command)); 
    t.detach(); 
}
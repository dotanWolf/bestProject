#ifndef THREAD_PER_CLIENT_EXECUTOR_H
#define THREAD_PER_CLIENT_EXECUTOR_H

#include "IExecutor.h" // Must include the base interface
#include <thread>      // Required for std::thread

class ThreadPerClientExecutor : public IExecutor {
public:
    virtual void execute(Runnable command) override; 

    // Destructor 
    virtual ~ThreadPerClientExecutor() = default; 
};

#endif
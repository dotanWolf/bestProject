#ifndef THREAD_EXECUTOR_H
#define THREAD_EXECUTOR_H

#include "IExecutor.h"
#include <thread>

class ThreadExecutor : public IExecutor {
public:
    // This implementation simply creates and detaches a new thread for the command
    void execute(Runnable* command) override {
        // Create a new thread, executing the Runnable's run() method
        std::thread t([command]() {
            command->run();
            // The Runnable object (ClientHandler) must be deleted after use, 
            // as it was allocated in ServerMain.cpp with 'new'.
            delete command; 
        });
        
        // Detach the thread so it runs independently 
        t.detach();
    }
    
};

#endif
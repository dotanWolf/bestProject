#ifndef THREAD_POOL_EXECUTOR_H
#define THREAD_POOL_EXECUTOR_H

#include "IExecutor.h"   
#include <vector>        // For worker threads
#include <thread>        // std::thread
#include <queue>         // Task queue
#include <mutex>         // Synchronization
#include <condition_variable>

class ThreadPoolExecutor : public IExecutor {
public:
    // Constructor: create a pool with a number of threads
    explicit ThreadPoolExecutor(size_t numThreads);

    // Must match IExecutor interface
    virtual void execute(Runnable command) override;

    // Destructor: shuts down the pool gracefully
    virtual ~ThreadPoolExecutor();

private:
    std::vector<std::thread> workers;          // Worker threads
    std::queue<Runnable> tasks;                // Task queue

    std::mutex queueMutex;
    std::condition_variable condition;
    bool stop;                                 // Signals shutdown
};

#endif
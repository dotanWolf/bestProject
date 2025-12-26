#include "ThreadPoolExecutor.h"
#include <iostream>

ThreadPoolExecutor::ThreadPoolExecutor(size_t numThreads) : stop(false) {
    for (size_t i = 0; i < numThreads; ++i) {
        workers.emplace_back([this] {
            while (true) {
                Runnable task;
                {
                    std::unique_lock<std::mutex> lock(this->queueMutex);
                    
                    this->condition.wait(lock, [this] {
                        return this->stop || !this->tasks.empty();
                    });

                    if (this->stop && this->tasks.empty())
                        return;

                    task = std::move(this->tasks.front());
                    this->tasks.pop();
                }
                //std::cout << "Worker Thread [" << std::this_thread::get_id() << "] is starting a task." << std::endl;
                task();
            }
        });
    }
}

void ThreadPoolExecutor::execute(Runnable command) {
    {
        std::lock_guard<std::mutex> lock(queueMutex);
        if (stop) return;
        tasks.push(std::move(command));
    }
    condition.notify_one();
}

ThreadPoolExecutor::~ThreadPoolExecutor() {
    {
        std::lock_guard<std::mutex> lock(queueMutex);
        stop = true;
    }
    condition.notify_all();
    for (std::thread &worker : workers) {
        if (worker.joinable())
            worker.join();
    }
}
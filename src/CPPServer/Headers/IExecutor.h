#ifndef IEXECUTOR_H
#define IEXECUTOR_H

#include <string>
#include <vector>
#include <optional>
#include "IExecutor.h"
#include <mutex>
#include <functional> // Required for std::function<void()>

class IExecutor {
public:
    using Runnable = std::function<void()>; 

    virtual void execute(Runnable command) = 0; 
    virtual ~IExecutor() = default; 
};

#endif
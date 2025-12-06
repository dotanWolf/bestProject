#ifndef IEXECUTOR_H
#define IEXECUTOR_H

#include <string>
#include <vector>
#include <optional>
#include "IExecutor.h"

using Runnable = std::function<void()>;

class IExecutor {
    private:
    IExecutor* execute;
    public:
    virtual void execute(Runnable command) = 0;
    };

#endif
#ifndef IEXECUTOR_H
#define IEXECUTOR_H

#include "Runnable.h"

class IExecutor {
public:
    virtual void execute(Runnable* command) = 0;
};

#endif

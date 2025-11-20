#ifndef GET_COMMAND_H
#define GET_COMMAND_H

#include "ICommand.h"
#include <string>

class getCommand : public ICommand {
public:
    void execute() override;   // only declared!
};

#endif

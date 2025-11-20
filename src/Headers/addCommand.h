#ifndef ADD_COMMAND_H
#define ADD_COMMAND_H

#include "ICommand.h"
#include <string>

class addCommand : public ICommand {
public:
    void execute() override;   // only declared!
};

#endif

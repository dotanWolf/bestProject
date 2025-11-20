//Searching through all files for specific content after decompression
//expected for search command
#ifndef SEARCH_COMMAND_H
#define SEARCH_COMMAND_H

#include "ICommand.h"
#include <string>

class searchCommand : public ICommand {
public:
    void execute() override;   // only declared!
};

#endif

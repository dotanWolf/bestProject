#ifndef GET_COMMAND_H
#define GET_COMMAND_H

#include <string>
#include <vector>
#include <optional>
#include "ICommand.h"

class getCommand : public ICommand {
public:
    // Executes the command
    void execute(std::optional<std::vector<std::string>> arguments,std::ostream& outputStream) override;

    // Validates the user's input and returns parsed arguments,
    // or std::nullopt if invalid
    std::optional<std::vector<std::string>> isValid(std::string input) override;
};

#endif 

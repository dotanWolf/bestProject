#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>
#include <vector>
#include <optional>

class ICommand {
    public:
    virtual void execute(std::optional<std::vector<std::string>>) = 0;
    virtual std::optional<std::vector<std::string>> isValid(std::string input) = 0;

};

#endif
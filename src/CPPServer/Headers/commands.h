//Enum for ADD / GET / SEARCH / INVALID
//Mapping text → command type
#ifndef COMMANDS_H
#define COMMANDS_H
#include <string>
#include <sstream>

enum class CommandType {
    ADD,
    GET,
    SEARCH,
    INVALID
};

// Maps the first word of the input to a CommandType
CommandType parseCommandType(const std::string& input);

#endif 
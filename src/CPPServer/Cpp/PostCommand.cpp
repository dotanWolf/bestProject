#include <vector>
#include <string>
#include <optional>
#include "PostCommand.h"
// this function does the same thing as the addcommand we already implemented
void PostCommand::execute(std::optional<std::vector<std::string>> arguments) {
}

std::optional<std::vector<std::string>> PostCommand::isValid(std::string input) {
    std::vector<std::string> vector;
    return vector; // FIX: Now returns the arguments vector
}

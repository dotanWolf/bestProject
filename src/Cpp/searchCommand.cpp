#include <vector>
#include <string>
#include "create.h"
#include <optional>
#include <cstdlib>
#include "create.h"
#include "ICommand.h"
#include "compress.h"
#include "save.h"
#include <sstream>
#include "searchCommand.h"

void searchCommand::execute(std::optional<std::vector<std::string>> arguments) {
    // Placeholder logic:
    // 1. Parse 'search [pattern]' from rawInput
    // 2. Iterate through all files in RLE_DIR
    // 3. For each file, load, decompress, and search for the pattern.
    // 4. Print results using printOutput()


}
std::optional<std::vector<std::string>> searchCommand::isValid(std::string input) {
     std::vector<std::string> vector;
    if (input.empty()) return std::nullopt;  // empty line is invalid

    size_t firstSpace = input.find(' ');
    if (firstSpace == std::string::npos) return std::nullopt;
    std::string cmd, rest;
    cmd = input.substr(0, firstSpace);
    if (cmd != "search") {
        return std::nullopt;   
    }
    rest = input.substr(firstSpace + 1, input.length() - firstSpace - 1);    
    if (rest.empty()) return std::nullopt;

    vector.push_back(rest);

    return vector;
}
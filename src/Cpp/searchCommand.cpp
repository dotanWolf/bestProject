#include <vector>
#include <string>
#include "create.h"
#include <optional>
#include <cstdlib>
#include "ICommand.h"
#include "save.h"
#include <sstream>
#include "searchCommand.h"
#include <filesystem>
#include "load.h"
#include "output.h"
#include <iostream>

void searchCommand::execute(std::optional<std::vector<std::string>> arguments) {
    // Placeholder logic:
    // 1. Parse 'search [pattern]' from rawInput
    // 2. Iterate through all files in RLE_DIR
    // 3. For each file, load, decompress, and search for the pattern.
    // 4. Print results using printOutput()
    const char* env_var_path = getenv(ENV_VAR);
    std::filesystem::path path(env_var_path);
    for (const auto& entry : std::filesystem::directory_iterator(path)) {
        std::string fileName = entry.path().filename();
        std::optional<std::string> optional = retFileContent(fileName);
        if (!optional.has_value()) return;
        std::string compressedfileContent = optional.value();
        std::string originalFileContent = getCompressor() -> decompress(compressedfileContent);
        if (originalFileContent.find(arguments.value()[0]) != std::string::npos){       
            printOutput(std::cout, fileName);
        }
    }
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
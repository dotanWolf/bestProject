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
    bool spaceNeeded = false;
    const char* env_var_path = getenv(ENV_VAR);
    std::filesystem::path path(env_var_path);
    // iterate over all files in RLE_DIR
    for (const auto& entry : std::filesystem::directory_iterator(path)) {
        std::string fileName = entry.path().filename().string();
        // skip over directories etc
        if (!entry.is_regular_file()) continue;
        std::optional<std::string> optional = retFileContent(fileName);
        // skip if couldnt read file
        if (!optional.has_value()) continue;
        std::string compressedfileContent = optional.value();
        // decompress the content
        std::string originalFileContent = getCompressor() -> decompress(compressedfileContent);
        // check if file contains the argument passed to the function as a substring
        if (originalFileContent.find(arguments.value()[0]) != std::string::npos){    
            if (spaceNeeded) printOutput(std::cout, " ");   
            printOutput(std::cout, fileName);
            spaceNeeded = true;
        }
    }
    printOutput(std::cout, "\n");
}
std::optional<std::vector<std::string>> searchCommand::isValid(std::string input) {
     std::vector<std::string> vector;
    if (input.empty()) return std::nullopt;  // empty line is invalid

    size_t firstSpace = input.find(' ');
    if (firstSpace == std::string::npos) return std::nullopt;
    std::string cmd, rest;
    // seperate the input until the first space
    // everything before is the command
    cmd = input.substr(0, firstSpace);
    if (cmd != "SEARCH") {
        return std::nullopt;   
    }
    // everything after is the rest
    rest = input.substr(firstSpace + 1, input.length() - firstSpace - 1);    
    if (rest.empty()) return std::nullopt;

    vector.push_back(rest);

    return vector;
}
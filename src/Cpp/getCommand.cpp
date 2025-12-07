#include <vector>
#include <string>
#include "create.h"
#include <optional>
#include <cstdlib>
#include "ICommand.h"
#include "input.h"
#include <filesystem>
#include "save.h"
#include "load.h"
#include "output.h"
#include <sstream>
#include "getCommand.h"
#include <iostream>

void getCommand::execute(std::optional<std::vector<std::string>> arguments) {
   // Placeholder logic:
    // 1. Parse 'get [fileName]' from rawInput
    // 2. Load compressed content using getContent()
    // 3. Decompress the content (Missing RLE Decompress function)
    // 4. Print the result using printOutput()
    // Validate arguments exist
    std::string name = arguments.value()[0];
    const char* env_var_path = getenv(ENV_VAR);
    if (!env_var_path) return;
    std::filesystem::path path(env_var_path);
    // iterate over all files in RLE_DIR
    for (const auto& entry : std::filesystem::directory_iterator(path)) {
        std::string fileName = entry.path().filename().string();
        // if we found the file
        if (fileName == arguments.value()[0]) {
            // get its content
            std::optional<std::string> optional = retFileContent(fileName);
            // skip if reading from the file failed
            if (!optional.has_value()) continue;
            std::string compressedfileContent = optional.value();
            // decompress its content
            std::string originalFileContent = getCompressor() -> decompress(compressedfileContent);
            // print it
            printOutput(std::cout, originalFileContent);
            printOutput(std::cout, "\n");
            break;
        }
    }
}
std::optional<std::vector<std::string>> getCommand::isValid(std::string input) {
    std::vector<std::string> vector;
    if (input.empty()) return std::nullopt;  // empty line is invalid

    size_t firstSpace = input.find(' ');
    if (firstSpace == std::string::npos) return std::nullopt;
    std::string cmd, rest;
    // seperate the input until the first space
    // everything before is the command
    cmd = input.substr(0, firstSpace);
    if (cmd != "GET") {
        return std::nullopt;   
    }
    // everything after is the filename
    rest = input.substr(firstSpace + 1, input.length() - firstSpace - 1);
    // the filename cannot be empty or contain spaces    
    if (rest.empty()) return std::nullopt;
    if (rest.find(' ') != std::string::npos) return std::nullopt;
    vector.push_back(rest);

    return vector;
}
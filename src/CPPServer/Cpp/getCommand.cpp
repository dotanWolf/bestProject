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
   if (!arguments || arguments->empty()) {
        printOutput(std::cout, "400 Bad Request\n\n");
        return;
    }
    const char* env_var_path = getenv(ENV_VAR);
    if (!env_var_path) return;

    std::string fileName = arguments.value()[0];
    std::string fileContent; 
    FileRetrievalStatus status = retFileContent(fileName, fileContent);
    std::string originalFileContent;
    switch (status) {
        case FileRetrievalStatus::SUCCESS:
            // Success: File was found and loaded.
            printOutput(std::cout, "200 Ok\n\n");
            originalFileContent = getCompressor() -> decompress(fileContent);
            printOutput(std::cout, originalFileContent);
            printOutput(std::cout, "\n"); 
            break;
            
        case FileRetrievalStatus::ERROR_FILE_NOT_FOUND:
            // Client error: File does not exist.
            printOutput(std::cout, "404 Not Found\n\n"); 
            break;
            
        case FileRetrievalStatus::ERROR_READ_FAILURE:
            // Server error: Internal I/O failure, permission error, or bad config.
            printOutput(std::cout, "500 Internal Server Error\n\n"); 
            break;
            
        default:
            // Catch any unexpected/unhandled enum values
            printOutput(std::cout, "500 Internal Server Error\n\n"); 
            break;
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
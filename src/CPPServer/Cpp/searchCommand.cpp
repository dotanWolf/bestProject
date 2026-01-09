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
using namespace std;
void searchCommand::execute(std::optional<std::vector<std::string>> arguments) {
    // Placeholder logic:
    // 1. Parse 'search [pattern]' from rawInput
    // 2. Iterate through all files in RLE_DIR
    // 3. For each file, load, decompress, and search for the pattern.
    // 4. Print results using printOutput()
    if (!arguments || arguments->empty()) {
        printOutput(std::cout, "400 Bad Request\n");
        return;
    }
    bool spaceNeeded = false;
    std::string searchPattern = arguments.value()[0];
    const char* env_var_path = getenv(ENV_VAR);
    if (!env_var_path) {
        printOutput(std::cout, "500 Internal Server Error\n");
        return;
    }   
    std::filesystem::path path(env_var_path);
    // iterate over all files in RLE_DIR
    int count=0;
    for (const auto& entry : std::filesystem::directory_iterator(path)) {
        
        std::string fileName = entry.path().filename().string();
        std::string fileContent;
        bool skip_file = false;

        if (!entry.is_regular_file()) continue;
        
        FileRetrievalStatus status = retFileContent(fileName, fileContent);
        
        switch (status) {
            case FileRetrievalStatus::SUCCESS:
                break; // Continue to processing
                
            case FileRetrievalStatus::ERROR_FILE_NOT_FOUND:
            case FileRetrievalStatus::ERROR_READ_FAILURE:
            default:
                // Failure to load this specific file: set skip flag and break switch
                skip_file = true; 
                break;
        }

        if (skip_file) continue; // Skip to next file if load failed
        
        std::string originalFileContent = getCompressor() -> decompress(fileContent);
        
        if (originalFileContent.find(searchPattern) != std::string::npos || fileName.find(searchPattern) != std::string::npos) { 
            count++;
            if(count==1){
                 printOutput(std::cout, "200 Ok\n\n");
            }
            if (spaceNeeded) printOutput(std::cout, " "); 
            printOutput(std::cout, fileName);
            spaceNeeded = true;
        }
    }
    if(count==0){
       printOutput(std::cout, "404 Not Found");  
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
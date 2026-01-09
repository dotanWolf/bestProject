#include "DeleteCommand.h"
#include "Parser.h"
#include "create.h" 
#include <iostream>
#include <algorithm>
#include <filesystem>
#include "deleteFile.h"
#include "output.h"
#include <iostream>

using namespace std;

// Forward declaration of the file system deletion function
void DeleteCommand::execute(std::optional<std::vector<std::string>> arguments) {
    // 1. Input Validation
    if (!arguments || arguments->empty()) {
        // HTTP 400 Bad Request
        printOutput(std::cout, "400 Bad Request");
        return;
    }
    std::string fileName = arguments.value()[0];
    FileDeletionStatus status = deleteFile(fileName);
    switch (status) {
        case FileDeletionStatus::SUCCESS:
            // File was found and successfully deleted.
            printOutput(std::cout, "204 No Content");
            break;
            
        case FileDeletionStatus::ERROR_FILE_NOT_FOUND:
            // The file did not exist when deleteFile was called.
            printOutput(std::cout, "404 Not Found"); 
            break;
            
        case FileDeletionStatus::ERROR_DELETION_FAILED:
            // The file existed, but the server couldn't remove it (permissions, I/O error).
            printOutput(std::cout, "500 Internal Server Error"); 
            break;
            
        default:
            // Catch any unexpected/unhandled enum values
            printOutput(std::cout, "500 Internal Server Error"); 
            break;
    }
}
std::optional<std::vector<std::string>> DeleteCommand::isValid(std::string input) {
        std::vector<std::string> vector;
    if (input.empty()) return std::nullopt;  // empty line is invalid

    size_t firstSpace = input.find(' ');
    if (firstSpace == std::string::npos) return std::nullopt;
    std::string cmd, rest;
    // seperate the input until the first space
    // everything before is the command
    cmd = input.substr(0, firstSpace);
    if (cmd != "DELETE") {
        return std::nullopt;   
    }
    // everything after is the rest
    rest = input.substr(firstSpace + 1, input.length() - firstSpace - 1);    
    if (rest.empty()) return std::nullopt;

    vector.push_back(rest);

    return vector;
}

#include <vector>
#include <string>
#include "create.h"
#include <optional>
#include <cstdlib>
#include "create.h"
#include "ICommand.h"
#include "save.h"
#include <sstream>
#include "addCommand.h"
#include "output.h"
#include <iostream>

void addCommand::execute(std::optional<std::vector<std::string>> arguments) {
    std::string fileName = arguments.value()[0];
    std::string text = arguments.value()[1];
    FileCreationStatus status = createFileInRleDir(fileName);
    
    switch (status) {
        case FileCreationStatus::SUCCESS:{
            std::string compressedText = getCompressor()->compress(text);
            
            FileSaveStatus saveStatus = insertTextToFile(compressedText, fileName);

            if (saveStatus == FileSaveStatus::SUCCESS) {
                printOutput(std::cout, "201 Created");
            } else {
                printOutput(std::cout, "500 Internal Server Error");
            }
            break;
        }
        case FileCreationStatus::ERROR_FILE_EXISTS:
            printOutput(std::cout, "404 Not Found"); 
            break;
            
        case FileCreationStatus::ERROR_ENV_VAR_MISSING:
            // Server configuration error
            printOutput(std::cout, "Internal Server Error 500");
            break;
            
        case FileCreationStatus::ERROR_FAILED_TO_OPEN:
            // Generic failure to open or write (could also be used as the default)
            printOutput(std::cout, "Internal Server Error 500");
            break;
            
        default:
            // Catch any unexpected/unhandled enum values
            printOutput(std::cout, "Internal Server Error 500");
            break;
    }
}

std::optional<std::vector<std::string>> addCommand::isValid(std::string input) {
    std::vector<std::string> vector;
    if (input.empty()) return std::nullopt;  // empty line is invalid

    size_t firstSpace = input.find(' ');
    if (firstSpace == std::string::npos) return std::nullopt;
    std::string cmd, fileName, rest;
    // gets the substring until the first space
    cmd = input.substr(0, firstSpace);
    if (cmd != "POST") {
        return std::nullopt;   
    }

    size_t secondSpace = input.find(' ', firstSpace + 1);
    if (secondSpace == std::string::npos) return std::nullopt;
    // get the substring of between the first and second space
    // the instructions gurrente a valid 'add' command will contain
    // add [filename] [rest] and file name doesnt have spaces
    fileName = input.substr(firstSpace + 1, secondSpace - firstSpace -1);
    if (fileName.empty()) return std::nullopt;
    // we can take whatever is left to be our text it must not be empty
    rest = input.substr(secondSpace + 1, input.length() - secondSpace - 1);    
    //if (rest.empty()) return std::nullopt;
    vector.push_back(fileName);
    vector.push_back(rest);

    return vector;
}

#include "DeleteCommand.h"
#include "Parser.h"
#include "create.h" 
#include <iostream>
#include <algorithm>
#include <filesystem>
#include "deleteFile.h"


using namespace std;

// Forward declaration of the file system deletion function
void DeleteCommand::execute(std::optional<std::vector<std::string>> arguments) {
    std::string fileName = arguments.value()[0];
    if (checkFileExists(fileName)) {
        deleteFile(fileName);
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

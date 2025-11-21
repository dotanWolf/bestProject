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
#include "addCommand.h"

void addCommand::execute(std::optional<std::vector<std::string>> arguments) {
    std::string fileName = arguments.value()[0];
    std::string text = arguments.value()[1];
    const char* env_var_path = getenv(ENV_VAR);
    if (createFileInRleDir(fileName)) {
        //cout << "created succsfully\n";
        // the file was created successfully, compress the text and write it in the file
        std::string fullPath = std::string(env_var_path) + "/" + fileName;
        insertTextToFile(RLEcompress(text), fullPath);
    }
 }

std::optional<std::vector<std::string>> addCommand::isValid(std::string input) {
    std::vector<std::string> vector;
    if (input.empty()) return std::nullopt;  // empty line is invalid
    std::istringstream iss(input);
    std::string cmd, fileName;
    iss >> cmd;
    if (cmd != "add") {
        return std::nullopt;   
    }
    // Check for file name
    if (!(iss >> fileName)) {
        return std::nullopt;
    }
    // Check if there is text after the file name
    std::string rest;
    std::getline(iss, rest);

    // Find first character that is not space or tab
    std::size_t firstSpace = rest.find(' ');
    // If there is no such character → only spaces/tabs → invalid
    if (firstSpace == std::string::npos) {
        return std::nullopt;
    }
    vector.push_back(fileName);
    vector.push_back(rest.substr(firstSpace + 1));

    // std::cout << vector[0] << std::endl;
    // std::cout << vector[1] << std::endl;
    return vector;
}

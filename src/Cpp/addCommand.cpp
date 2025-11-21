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

class addCommand : public ICommand{
    public:

    void execute(std::optional<std::vector<std::string>> arguments) {
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

    std::optional<std::vector<std::string>> isValid(std::string input) {
        if (input.empty()) return std::nullopt;  // empty line is invalid
        std::istringstream iss(input);
        std::string cmd, fileName;
        iss >> cmd;
        if (cmd != "add") return std::nullopt;   
        // Check for file name
        if (!(iss >> fileName)) return std::nullopt;
        // Check if there is text after the file name
        std::string rest;
        std::getline(iss, rest);
        // Find first character that is not space or tab
        std::size_t firstNonSpace = rest.find_first_not_of(" \t");
        // If there is no such character → only spaces/tabs → invalid
        if (firstNonSpace == std::string::npos) {
            return std::nullopt;
        }
        std::vector<std::string> vector = {"fjakl"};
        return vector;
    }
};
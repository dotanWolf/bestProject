#include "parse.h"
#include <vector>
#include <sstream>

bool validParseForAdd(std::string input) {

    if (input.empty()) return false;  // empty line → invalid

    std::istringstream iss(input);
    std::string cmd, fileName;

    iss >> cmd;
    if (cmd != "add") return false;   

    // Check for file name
    if (!(iss >> fileName)) return false;

    // Check if there is text after the file name
    std::string rest;
    std::getline(iss, rest);

    // Find first character that is not space or tab
    std::size_t firstNonSpace = rest.find_first_not_of(" \t");

    // If there is no such character → only spaces/tabs → invalid
    if (firstNonSpace == std::string::npos) {
        return false;
    }

    return true;
}

std::vector<std::string> parseAddCommand(std::string input) {

    std::vector<std::string> v;

    std::istringstream iss(input);
    std::string cmd, fileName;

    // Skip the "add" token
    iss >> cmd;

    // Read the file name
    iss >> fileName;

    // The remaining part of the input is the text
    std::string rest;
    std::getline(iss, rest);

        // Find first non-space/non-tab character
    std::size_t firstNonSpace = rest.find_first_not_of(" \t");

    std::string text;
    if (firstNonSpace == std::string::npos) {
        // No real text – text is empty (shouldn't happen if validParseForAdd was checked)
        text = "";
    } else {
        // Keep from first non-space to the end
        text = rest.substr(firstNonSpace);   // "aabbbddd", not "  aabbbddd"
    }

    v.push_back(fileName);
    v.push_back(text);

    return v;
}
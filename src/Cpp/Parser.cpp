#include <string>
#include "Parser.h"
 //Extracts the first token from a string.
std::string Parser::getFirstWord(std::string str) {
    size_t spaceIndex = str.find(' ');  // Find the index of the first space character
    if(spaceIndex != std::string::npos) {   // If a space exists, return the substring before it
        return str.substr(0, spaceIndex);
    }
    return str;
}

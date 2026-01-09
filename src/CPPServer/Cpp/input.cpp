#include <string>
#include <iostream>

 std::string getInputFromStream(std::istream& is) {
    std::string userInput ;
    // wait for user input
    if (std::getline(is, userInput)) {
        return userInput;
    }
    return "";
}

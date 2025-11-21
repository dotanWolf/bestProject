#include <string>
#include <iostream>

 std::string getInputFromStream(istream& is) {
    string userInput ;
    // wait for user input
    getline(is, userInput);
    return userInput;
}

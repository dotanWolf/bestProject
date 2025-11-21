// Function used for reciving input. This abstraction allows changing the input destination in future exercises.
#include "input.h"
#include <iostream>
#include <string>
using namespace std;

string retInput() {
    string userInput;
    // Reads an entire line from the standard input (stdin)
    getline(std::cin, userInput);
    return userInput;
}
//In the future we might refactor this function according to the instruction given on changing the input destination.
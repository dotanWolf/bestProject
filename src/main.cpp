#include <iostream>
#include "parse.h"
using namespace std;

int main() {
    string userInput;
    cin >> userInput;
    if (validParseForAdd(userInput)) {
        vector vector = parseAddCommand(userInput);
    }
}
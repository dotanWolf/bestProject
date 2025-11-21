#include "input.h"
#include <map>
#include "ICommand.h"
#include <iostream>
#include <string>
#include <vector>
#include <Parser.h>
#include <App.h>
using namespace std;

       
App::App(const map<string, ICommand*> commands)
    : commands(commands) {}

void App::run() {
    string userInput = getInputFromStream(cin);
    // check if its format is add [file name] [text]
    while (true) {
        string command = Parser::getFirstWord(userInput);
        try {
            std::optional<std::vector<std::string>> arguments = commands[command]->isValid(userInput);
            if(arguments) {
                commands[command] -> execute(arguments);
            }
        } catch (...) {
            continue;
        }
    }
}


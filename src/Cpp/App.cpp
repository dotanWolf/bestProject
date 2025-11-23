#include "input.h"
#include <map>
#include "ICommand.h"
#include <iostream>
#include <string>
#include <vector>
#include <Parser.h>
#include <App.h>
using namespace std;

       
App::App(const map<string, ICommand*> commands, ICompressor* compressor)
    : commands(commands), compressor(compressor) {}

void App::run() {
    for (const auto& pair : commands) {
        ICommand* command = pair.second;
        if (command) {
            command -> setCompressor(compressor); 
        }
    }
    while (true) {
        string userInput = getInputFromStream(cin);
        string command = Parser::getFirstWord(userInput);
        try {
            std::optional<std::vector<std::string>> arguments = commands[command]->isValid(userInput);

            if(arguments) {
                commands[command] -> execute(arguments);
            }
        } catch (...) {
        }
    }
}


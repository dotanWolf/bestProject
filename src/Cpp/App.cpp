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
        ICommand* command = pair.second;  // pointer stored inside the map
        if (command) {
            command -> setCompressor(compressor); 
        }
    }
    while (true) {
        // Read a full line of user input
        string userInput = getInputFromStream(cin);
        if (userInput.empty()) {
             continue;
        }
        string command = Parser::getFirstWord(userInput);   // Extract the first word (command name)
        if (command.empty()) {
            continue;
        }
        auto it = commands.find(command);
        if (it == commands.end() || it->second == nullptr) {
            // Unknown command → ignore instead of crash
            continue;
        }
        ICommand* cmd = it->second;
        try {
            auto arguments = cmd->isValid(userInput);
            if (!arguments || arguments->empty()) {
                continue;   // invalid input, ignore safely
            }

            cmd->execute(arguments);

        } catch (...) {
            continue; // Ignore errors and keep the program running
        }
    }
}

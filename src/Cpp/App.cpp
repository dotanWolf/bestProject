#include "input.h"
#include <map>
#include "ICommand.h"
#include <iostream>
#include <string>
#include <vector>
#include "Parser.h" // Corrected header style for non-system headers
#include "App.h"    // Must include the class header
#include <algorithm> 

using namespace std;

App::App(const map<string, ICommand*> commands, ICompressor* compressor)
    : commands(commands), compressor(compressor) 
{
    // Initialize the compressor for all commands once at startup
    for (const auto& pair : commands) {
        ICommand* command = pair.second;
        if (command) {
            command->setCompressor(compressor); 
        }
    }
}
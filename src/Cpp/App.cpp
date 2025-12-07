#include "input.h"
#include <map>
#include "ICommand.h"
#include <iostream>
#include <string>
#include <vector>
#include <Parser.h>
#include "App.h"
#include <algorithm> 
#include <cctype>    
#include <mutex>
#include <chrono>
#include <thread>

using namespace std;

       
App::App(const std::map<std::string, ICommand*> commands, ICompressor* compressor,  std::mutex* mutex) 
    : commands(commands), compressor(compressor), sharedMutex(mutex) {
}
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
    

void App::executeSingleCommand(std::istream& is, std::ostream& os) {
    std::lock_guard<std::mutex> lock(*sharedMutex);
    // 1. Ensure compressors are set (only needed once, but safe to call)
    for (const auto& pair : commands) {
        ICommand* command = pair.second;
        if (command) {
            command->setCompressor(compressor); 
        }
    }
    
    // 2. Read input from the provided stream 'is'
    std::string userInput = getInputFromStream(is);
    if (userInput.empty()) {
        return; // No command received
    }
    
    // 3. Parse and execute the command (Logic mirrors App::run())
    std::string commandName = Parser::getFirstWord(userInput);
    std::string upperCommandName = commandName;
    std::transform(upperCommandName.begin(), upperCommandName.end(), upperCommandName.begin(), ::toupper);
    userInput.replace(0, commandName.length(), upperCommandName);

    auto it = commands.find(upperCommandName);
    
    // Default error response for unknown or structurally invalid commands
    string errorResponse = "400 Bad Request\n";
    
    if (it == commands.end() || it->second == nullptr) {
        os << errorResponse;
        return;
    }
    
    ICommand* cmd = it->second;
    
    try {
        auto arguments = cmd->isValid(userInput);
        
        if (!arguments || arguments->empty()) {
            os << errorResponse;
            return;
        }
        //Suppose to get mutex from server using constructor and lock it here
        cmd->execute(arguments); 

    } catch (const std::runtime_error& e) {
        // Logically invalid command (e.g., DELETE on non-existent file)
        os << "404 Not Found\n";
    } catch (...) {
        // Unknown or unexpected internal error
        os << errorResponse;
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(5000));
}
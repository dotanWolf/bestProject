#ifndef APP_H
#define APP_H

#include <map>
#include <string>
#include <vector>
#include <optional>

#include "ICommand.h"

class App {
private:
    std::map<std::string, ICommand*> commands;

public:
    // Constructor
    App(const std::map<std::string, ICommand*> commands);

    // Runs the main application loop
    void run();
};

#endif

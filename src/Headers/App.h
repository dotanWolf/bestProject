#ifndef APP_H
#define APP_H

#include <map>
#include <string>
#include <vector>
#include <optional>
#include "ICompressor.h"
#include "ICommand.h"

class App {
public:
    // maps each string of a command to its object
    std::map<std::string, ICommand*> commands;
    // some compresssor that can compress and decompress based on some algorithm
    ICompressor* compressor;

public:
    // Constructor
    App(const std::map<std::string, ICommand*> commands, ICompressor* compressor);

    // Runs the main application loop
    void run();
};

#endif

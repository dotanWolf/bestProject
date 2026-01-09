#include <iostream>
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include <map>
#include "ICommand.h"
#include "addCommand.h"
#include "getCommand.h"
#include "searchCommand.h"
#include "App.h"
#include "ICompressor.h"
#include "RLECompressor.h"

using namespace std;

// int main() {
    
//     map<string, ICommand*> commands;
//     ICompressor* compressor = new RLECompressor();

//     ICommand* add = new addCommand();
//     commands["add"] = add;
//     ICommand* get = new getCommand();
//     commands["get"] = get;
//     ICommand* search = new searchCommand();
//     commands["search"] = search;

//     App app(commands, compressor);
//     app.run();
// }
#include <iostream>
#include "parse.h"
#include "compress.h"
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include <map>
#include "ICommand.h"
#include "addCommand.h"
#include "getComamnd.h"
#include "searchCommand.h"
#include "App.h"
using namespace std;

int main() {
    map<string, ICommand*> commands;

    ICommand* add = new addCommand();
    commands["add"] = add;
    ICommand* get = new getCommand();
    commands["add"] = get;
    ICommand* search = new searchCommand();
    commands["search"] = search;

    App app(commands);
    app.run();
}
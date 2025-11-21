#include "addCommand.h"
#include "parse.h"
#include "compress.h"
#include "create.h"
#include "save.h"
#include <vector>
#include <string>
#include <iostream>
#include <cstdlib> // For getenv

using namespace std;

bool addCommand::execute() {
    string userInput;
    getline(cin, userInput);//need to change
    // 1. Validate and Parse Input
    if (!validParseForAdd(rawInput)) {  
        return false;
    }

   vector<std::string> parsedData = parseAddCommand(rawInput);

    string fileName = parsedData[0];
    string text = parsedData[1];

    // 2. Check Environment Variable for Directory Path
    const char* env_var_path = getenv(ENV_VAR); 
  
    // 3. Create File
    if (!createFileInRleDir(fileName)) {
        return false;
    }

    // 4. Compress Text
    string compressedText = RLEcompress(text);

    // 5. Save Compressed Text
    string fullPath = string(env_var_path) + "/" + fileName;
    insertTextToFile(RLEcompress(text), fullPath);
    return true;
}
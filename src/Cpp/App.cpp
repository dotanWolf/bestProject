#include "input.h"

class App {
    private:
        map<string, ICommand*> commands;
        IParser* 
       
    public:
        App(const map<string, ICommand*> commands)
            : commands(commands) {}

        void run() {
            string userInput = getInputFromStream(cin);
            // check if its format is add [file name] [text]
            while (true) {
                vector<string> vector = parseString(userInput);

                try {
                    commands[vector[0]] -> execute();
                } catch (...) {
                    continue;
                }
                userInput = getInputFromStream(cin);
            }

            if (vector[0] == "add") {
                if (validParseForAdd(userInput)) {
                    // if so extract the file name and text
                    vector<string> vector = parseAddCommand(userInput);
                    string fileName = vector[0];
                    string text = vector[1];

                    const char* env_var_path = getenv(ENV_VAR);
                    // cout << env_var_path;
                    if (createFileInRleDir(fileName)) {
                        //cout << "created succsfully\n";
                        // the file was created successfully, compress the text and write it in the file
                        string fullPath = string(env_var_path) + "/" + fileName;
                        insertTextToFile(RLEcompress(text), fullPath);
                    }
                    return 1;
                }
                return 0;

            } else if (vector[0] = "search") {

            } else if (vector[0] = "get") {

            }


        }

}
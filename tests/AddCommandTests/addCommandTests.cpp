#include <gtest/gtest.h>
#include <iostream>
#include "parse.h"
#include "compress.h"
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
using namespace std;

static int helpChecker(std:: string userInput) {
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
}
TEST(testForAll, validArguemts){
     EXPECT_EQ(helpChecker("add file test"), 1);
     EXPECT_EQ(helpChecker("addd file test"), 0);
}



int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

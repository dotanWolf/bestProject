#include <gtest/gtest.h>
#include <iostream>
#include "create.h"
#include "save.h"
#include "output.h"
#include <cstdlib>
#include <vector>
#include "getCommand.h"
#include "ICommand.h"
#include <filesystem>
#include "RLECompressor.h"
#include "ICompressor.h"
using namespace std;    

TEST(getCommandTest, Validation){
    ICommand* command = new getCommand();
    EXPECT_EQ(command -> isValid("gett "), nullopt);
    EXPECT_EQ(command -> isValid(" get aabbbddd"), nullopt);
    EXPECT_EQ(command -> isValid(""), nullopt);
    EXPECT_EQ(command -> isValid("GET newFile aabbbddd"), nullopt);
    EXPECT_EQ(command -> isValid("GET   aabbbddd "), nullopt);
    EXPECT_EQ(command -> isValid("GET aabbbddd cccccdddaaa"), nullopt);
    EXPECT_EQ(command -> isValid("GET aabbbddd cccc  cdddaaa   "), nullopt);
    vector<string> vector = {"newFile"};
    EXPECT_EQ(command -> isValid("GET newFile"), vector);
    EXPECT_EQ(command -> isValid("GET newFile "), nullopt);
    }

TEST(getCommandTest, execute){
    ICommand* command = new getCommand();
    ICompressor* compressor = new RLECompressor();
    command->setCompressor(compressor);
    
    createFileInRleDir("a");
    insertTextToFile("5a", "a"); // compressed content

    std::vector<std::string> args = {"a"};

    std::streambuf* original = std::cout.rdbuf();
    std::stringstream captured;
    std::cout.rdbuf(captured.rdbuf());

    command->execute(args);

    std::cout.rdbuf(original);

    EXPECT_EQ("200 Ok\n\naaaaa\n", captured.str());

    // cleanup
    const char* env = getenv(ENV_VAR);
    std::filesystem::remove(std::filesystem::path(env) / "a");
}
int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

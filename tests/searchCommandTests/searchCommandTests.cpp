#include <gtest/gtest.h>
#include <iostream>
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include "searchCommand.h"
#include "ICommand.h"
#include <filesystem>
#include "RLECompressor.h"
#include "ICompressor.h"

using namespace std;

TEST(searchCommandTest, Validation){
    ICommand* command = new searchCommand();
    EXPECT_EQ(command -> isValid("searchh "), nullopt);
    EXPECT_EQ(command -> isValid(" search aabbbddd"), nullopt);
    EXPECT_EQ(command -> isValid(""), nullopt);
    vector<string> vector = {"newFile aabbbddd"};
    EXPECT_EQ(command -> isValid("search newFile aabbbddd"), vector);
    vector = {"  aabbbddd "};
    EXPECT_EQ(command -> isValid("search   aabbbddd "), vector);
    vector = {"aabbbddd cccccdddaaa"};
    EXPECT_EQ(command -> isValid("search aabbbddd cccccdddaaa"), vector);
    vector = {"aabbbddd cccc  cdddaaa   "};
    EXPECT_EQ(command -> isValid("search aabbbddd cccc  cdddaaa   "), vector);
}

TEST(searchCommandTest, execute){
    ICommand* command = new searchCommand();
    ICompressor* compressor = new RLECompressor();
    command -> setCompressor(compressor);

    createFileInRleDir("a");
    insertTextToFile("5a", "a");
    createFileInRleDir("b");
    insertTextToFile("5a", "b");
    createFileInRleDir("c");
    insertTextToFile("5b", "c");
    std::vector<std::string> vector = {"aaaaa"};

    std::streambuf* original_cout_buffer = std::cout.rdbuf();
    std::stringstream captured_output;
    std::cout.rdbuf(captured_output.rdbuf());
    
    command -> execute(vector);

    std::cout.rdbuf(original_cout_buffer);

    EXPECT_EQ("a\nb\n", captured_output.str());

    const char* env = std::getenv(ENV_VAR);
    std::filesystem::path dirPath(env);
    std::filesystem::path fullPath = dirPath / "a";
    std::filesystem::remove(fullPath);
    fullPath = dirPath / "b";
    std::filesystem::remove(fullPath);
    fullPath = dirPath / "c";
    std::filesystem::remove(fullPath);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
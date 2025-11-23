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
        EXPECT_EQ(command -> isValid("get newFile aabbbddd"), nullopt);
        EXPECT_EQ(command -> isValid("get   aabbbddd "), nullopt);
        EXPECT_EQ(command -> isValid("get aabbbddd cccccdddaaa"), nullopt);
        EXPECT_EQ(command -> isValid("get aabbbddd cccc  cdddaaa   "), nullopt);
        vector<string> vector = {"newFile"};
        EXPECT_EQ(command -> isValid("get newFile"), vector);
        EXPECT_EQ(command -> isValid("get newFile "), nullopt);
    }

    TEST(getCommandTest, execute){
        ICommand* command = new getCommand();
        ICompressor* compressor = new RLECompressor();
        command -> setCompressor(compressor);

        createFileInRleDir("a");
        insertTextToFile("5a", "a");
        createFileInRleDir("b");
        insertTextToFile("5a", "b");
        createFileInRleDir("c");
        insertTextToFile("5b", "c");
        std::vector<std::string> vector = {"a"};

        std::streambuf* original_cout_buffer = std::cout.rdbuf();
        std::stringstream captured_output;
        std::cout.rdbuf(captured_output.rdbuf());
        
        command -> execute(vector);

        std::cout.rdbuf(original_cout_buffer);

        EXPECT_EQ("aaaaa\n", captured_output.str());

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

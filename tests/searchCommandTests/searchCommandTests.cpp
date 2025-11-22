#include <gtest/gtest.h>
#include <iostream>
#include "parse.h"
#include "compress.h"
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include "searchCommand.h"
#include "ICommand.h"

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

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

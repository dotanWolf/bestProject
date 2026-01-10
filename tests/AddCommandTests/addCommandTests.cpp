#include <gtest/gtest.h>
#include <iostream>
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include "addCommand.h"
#include "ICommand.h"

using namespace std;

TEST(addCommandTest, Validation){
    ICommand* command = new addCommand();
    EXPECT_EQ(command -> isValid("addd newFile aabbbddd"), nullopt);
    EXPECT_EQ(command -> isValid(" POST newFile aabbbddd"), nullopt);
    EXPECT_EQ(command -> isValid(""), nullopt);
    EXPECT_EQ(command -> isValid("POST newFile"), nullopt);
    // need to check if an empty content is considered invalid or not
    vector<string> vector = {"newFile", ""};
    EXPECT_EQ(command -> isValid("POST newFile "), vector);
    EXPECT_EQ(command -> isValid("POST  newFile"), nullopt);
    vector = {"newFile", "aabbbddd cccccdddaaa"};
    EXPECT_EQ(command -> isValid("POST newFile aabbbddd cccccdddaaa"), vector);
    vector = {"new", "File aabbbddd cccccdddaaa"};
    EXPECT_EQ(command -> isValid("POST new File aabbbddd cccccdddaaa"), vector);
    vector = {"new", "File aabbbddd cccc  cdddaaa   "};
    EXPECT_EQ(command -> isValid("POST new File aabbbddd cccc  cdddaaa   "), vector);

}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

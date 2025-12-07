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
    EXPECT_EQ(command -> isValid("delette newFile"), nullopt);
    EXPECT_EQ(command -> isValid(" DELETE newFile"), nullopt);
    EXPECT_EQ(command -> isValid(""), nullopt);
    EXPECT_EQ(command -> isValid("DELET E newFile"), nullopt);
    vector<string> vector = {"newFile", ""};
    EXPECT_EQ(command -> isValid("DELETE newFile"), vector);
    EXPECT_EQ(command -> isValid("DELETE  newFile"), nullopt);
    EXPECT_EQ(command -> isValid("DELETE newFile aabbbddd cccccdddaaa"), nullopt);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

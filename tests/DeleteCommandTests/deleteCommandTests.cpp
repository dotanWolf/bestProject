#include <gtest/gtest.h>
#include <iostream>
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include "DeleteCommand.h"
#include "deleteFile.h"
#include "ICommand.h"

using namespace std;

TEST(deleteCommandTest, Validation){
    ICommand* command = new DeleteCommand();
    EXPECT_EQ(command -> isValid("delette newFile"), nullopt);
    EXPECT_EQ(command -> isValid(" DELETE newFile"), nullopt);
    EXPECT_EQ(command -> isValid(""), nullopt);
    EXPECT_EQ(command -> isValid("DELET E newFile"), nullopt);
    vector<string> vector = {"newFile"};
    EXPECT_EQ(command -> isValid("DELETE newFile"), vector);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

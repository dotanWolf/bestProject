#include <gtest/gtest.h>
#include <iostream>
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include "addCommand.h"
#include "ICommand.h"
#include "load.h"

using namespace std;

TEST(loadTests, retFileContent)
{
    std::string out;

    ASSERT_EQ(createFileInRleDir("newFile"), FileCreationStatus::SUCCESS);
    ASSERT_EQ(insertTextToFile("AAAAAAAABBBB", "newFile"), FileSaveStatus::SUCCESS);
    ASSERT_EQ(retFileContent("newFile", out), FileRetrievalStatus::SUCCESS);
    EXPECT_EQ(out, "AAAAAAAABBBB");

    ASSERT_EQ(createFileInRleDir("newFile1"), FileCreationStatus::SUCCESS);
    ASSERT_EQ(insertTextToFile("jfkdlksjglk    jsfjkls", "newFile1"), FileSaveStatus::SUCCESS);
    ASSERT_EQ(retFileContent("newFile1", out), FileRetrievalStatus::SUCCESS);
    EXPECT_EQ(out, "jfkdlksjglk    jsfjkls");

    ASSERT_EQ(createFileInRleDir("newFile2"), FileCreationStatus::SUCCESS);
    ASSERT_EQ(insertTextToFile("\n\n\naaaaa\n", "newFile2"), FileSaveStatus::SUCCESS);
    ASSERT_EQ(retFileContent("newFile2", out), FileRetrievalStatus::SUCCESS);
    EXPECT_EQ(out, "\n\n\naaaaa\n");

    ASSERT_EQ(createFileInRleDir("newFile3"), FileCreationStatus::SUCCESS);
    ASSERT_EQ(insertTextToFile("fjsdklfjask   \n54832", "newFile3"), FileSaveStatus::SUCCESS);
    ASSERT_EQ(retFileContent("newFile3", out), FileRetrievalStatus::SUCCESS);
    EXPECT_EQ(out, "fjsdklfjask   \n54832");
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

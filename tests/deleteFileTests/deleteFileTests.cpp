#include <gtest/gtest.h>
#include <iostream>
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include <filesystem>  
#include "DeleteCommand.h"
#include "deleteFile.h"
#include "output.h"
#include "ICommand.h"
#include <fstream>

using namespace std;
namespace fs = std::filesystem;

TEST(deleteFileTest, Validation){
    FileCreationStatus statusC=createFileInRleDir("deleteFIleTests");
    ASSERT_EQ(statusC, FileCreationStatus::SUCCESS);
    FileDeletionStatus statusD=deleteFile("deleteFIleTests");
    EXPECT_EQ(statusD, FileDeletionStatus::SUCCESS);
    bool res=checkFileExists("deleteFIleTests");
    EXPECT_FALSE(res);
}
TEST(deleteFileTest, FailureNotFound) {
    const string filename = "non_existent_file";
    
    FileDeletionStatus statusD = deleteFile(filename);

    EXPECT_EQ(statusD, FileDeletionStatus::ERROR_FILE_NOT_FOUND);

    EXPECT_FALSE(checkFileExists(filename));
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

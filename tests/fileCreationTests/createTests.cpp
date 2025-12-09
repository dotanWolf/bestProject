#include "create.h"
#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include <cstdlib>

namespace fs = std::filesystem;

/* Get the path from the RLE_DIR environment variable */
static std::string getRleDir()
{
    const char* env = std::getenv("RLE_DIR");
    return env ? std::string(env) : "";
}

/* Tests */

TEST(createFile, createsFileInRleDir)
{
    std::string rleDir = getRleDir();
    ASSERT_FALSE(rleDir.empty());

    FileCreationStatus status = createFileInRleDir("newFile");
    ASSERT_EQ(status, FileCreationStatus::SUCCESS);

    fs::path filePath = fs::path(rleDir) / "newFile";
    ASSERT_TRUE(fs::exists(filePath));
    ASSERT_TRUE(fs::is_regular_file(filePath));
    EXPECT_EQ(fs::file_size(filePath), 0u);
}

TEST(createFile, canCreateMultipleFilesInSameDir)
{
    std::string rleDir = getRleDir();
    ASSERT_FALSE(rleDir.empty());

    FileCreationStatus s1 = createFileInRleDir("file1");
    FileCreationStatus s2 = createFileInRleDir("file2");


    ASSERT_EQ(s1, FileCreationStatus::SUCCESS);
    ASSERT_EQ(s2, FileCreationStatus::SUCCESS);


    EXPECT_TRUE(fs::exists(fs::path(rleDir) / "file1"));
    EXPECT_TRUE(fs::exists(fs::path(rleDir) / "file2"));
}

TEST(CreateFileTest, FailsIfFileAlreadyExists)
{
    std::string rleDir = getRleDir();
    ASSERT_FALSE(rleDir.empty());

    // First creation 
    ASSERT_EQ(createFileInRleDir("existingFile"), FileCreationStatus::SUCCESS);

    // Second creation → should fail
    ASSERT_EQ(createFileInRleDir("existingFile"), FileCreationStatus::ERROR_FILE_EXISTS);
}

/* Run tests */
int main(int argc, char** argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

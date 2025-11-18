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

    bool res = createFileInRleDir("newFile");
    ASSERT_TRUE(res);

    fs::path filePath = fs::path(rleDir) / "newFile";
    ASSERT_TRUE(fs::exists(filePath));
    ASSERT_TRUE(fs::is_regular_file(filePath));
    EXPECT_EQ(fs::file_size(filePath), 0u);
}

TEST(createFile, canCreateMultipleFilesInSameDir)
{
    std::string rleDir = getRleDir();
    ASSERT_FALSE(rleDir.empty());

    bool res1 = createFileInRleDir("file1");
    bool res2 = createFileInRleDir("file2");

    ASSERT_TRUE(res1);
    ASSERT_TRUE(res2);

    EXPECT_TRUE(fs::exists(fs::path(rleDir) / "file1"));
    EXPECT_TRUE(fs::exists(fs::path(rleDir) / "file2"));
}


/* Run tests */
int main(int argc, char** argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

#include "save.h"
#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include "create.h"

namespace fs = std::filesystem;

/* Helpers */

static std::string getRleDir()
{
    const char* env = std::getenv("RLE_DIR");
    return env ? std::string(env) : "";
}

static std::string readFileToString(const fs::path& path)
{
    std::ifstream in(path, std::ios::binary);
    std::ostringstream buffer;
    buffer << in.rdbuf();
    return buffer.str();
}

/* Tests */

TEST(insertTextToFile, CreatesNewFileAndWritesTextInRleDir)
{
    std::string rleDir = getRleDir();
    ASSERT_FALSE(rleDir.empty());

    fs::path filePath = fs::path(rleDir) / "newFile";
    fs::remove(filePath);

    std::string text = "aabbbddd cccccdddaaa";
    ASSERT_EQ(createFileInRleDir("newFile"), FileCreationStatus::SUCCESS);
    FileSaveStatus res = insertTextToFile(text, "newFile");
    ASSERT_EQ(res, FileSaveStatus::SUCCESS);

    ASSERT_TRUE(fs::exists(filePath));
    ASSERT_TRUE(fs::is_regular_file(filePath));
    EXPECT_EQ(readFileToString(filePath), text);
}

TEST(insertTextToFile, OverwritesExistingFileContent)
{
    std::string rleDir = getRleDir();
    ASSERT_FALSE(rleDir.empty());
    fs::path filePath = fs::path(rleDir) / "existingFile";
    fs::remove(filePath);

    ASSERT_EQ(createFileInRleDir("existingFile"), FileCreationStatus::SUCCESS);
    std::string out = "old content";
    FileSaveStatus res = insertTextToFile(out, "existingFile");
    ASSERT_EQ(res, FileSaveStatus::SUCCESS);

    std::string newText = "new content";

    res = insertTextToFile(newText, "existingFile");
    ASSERT_EQ(res, FileSaveStatus::SUCCESS);
    EXPECT_EQ(readFileToString(filePath), "new content");
}

/* Run tests */
int main(int argc, char** argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

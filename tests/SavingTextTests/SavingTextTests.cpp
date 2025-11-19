#include "save.h"
#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <cstdlib>

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
    fs::remove(filePath); // make sure it does not exist

    std::string text = "aabbbddd cccccdddaaa";

    bool res = insertTextToFile(text, filePath.string());
    ASSERT_TRUE(res);

    ASSERT_TRUE(fs::exists(filePath));
    ASSERT_TRUE(fs::is_regular_file(filePath));
    EXPECT_EQ(readFileToString(filePath), text);
}

TEST(insertTextToFile, OverwritesExistingFileContent)
{
    std::string rleDir = getRleDir();
    ASSERT_FALSE(rleDir.empty());

    fs::path filePath = fs::path(rleDir) / "existingFile";

    {
        std::ofstream out(filePath, std::ios::binary | std::ios::trunc);
        out << "old content";
    }

    std::string newText = "new content";

    bool res = insertTextToFile(newText, filePath.string());
    ASSERT_TRUE(res);

    ASSERT_TRUE(fs::exists(filePath));
    ASSERT_TRUE(fs::is_regular_file(filePath));
    EXPECT_EQ(readFileToString(filePath), newText);
}

TEST(insertTextToFile, ReturnsFalseWhenPathIsDirectory)
{
    std::string text = "should not be written";

    fs::path dirPath = fs::temp_directory_path();
    ASSERT_TRUE(fs::exists(dirPath));
    ASSERT_TRUE(fs::is_directory(dirPath));

    bool res = insertTextToFile(text, dirPath.string());
    EXPECT_FALSE(res);
}

/* Run tests */
int main(int argc, char** argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

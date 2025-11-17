#include "create.h"
#include <gtest/gtest.h>

#include <filesystem>
#include <fstream>
#include <cstdlib>

namespace fs = std::filesystem;

static std::string setupRleDir()
{
    fs::path p = fs::temp_directory_path() / "rle_tests_dir";

    if (fs::exists(p)) {
        fs::remove_all(p);
    }
    fs::create_directories(p);

#ifdef _WIN32
    _putenv_s("RLE_DIR", p.string().c_str());
#else
    setenv("RLE_DIR", p.string().c_str(), 1);
#endif

    return p.string();           
}

// Tests 

TEST(createFile, createsFileInRleDir)
{
    std::string rleDir = setupRleDir();

    bool res = createFileInRleDir("newFile");

    ASSERT_TRUE(res);

    fs::path filePath = fs::path(rleDir) / "newFile";
    ASSERT_TRUE(fs::exists(filePath));
    ASSERT_TRUE(fs::is_regular_file(filePath));

    EXPECT_EQ(fs::file_size(filePath), 0u);
}

TEST(createFile, canCreateMultipleFilesInSameDir)
{
    std::string rleDir = setupRleDir();

    bool res1 = createFileInRleDir("file1");
    bool res2 = createFileInRleDir("file2");

    ASSERT_TRUE(res1);
    ASSERT_TRUE(res2);

    EXPECT_TRUE(fs::exists(fs::path(rleDir) / "file1"));
    EXPECT_TRUE(fs::exists(fs::path(rleDir) / "file2"));
}

TEST(createFile, failsWhenRleDirDoesNotExist)
{
#ifdef _WIN32
    _putenv_s("RLE_DIR", "C:\\this\\path\\definitely\\doesnt\\exist");
#else
    setenv("RLE_DIR", "/this/path/definitely/doesnt/exist", 1);
#endif

    bool res = createFileInRleDir("newFile");

    EXPECT_FALSE(res);
}

TEST(createFile, failsWhenRleDirNotSet)
{
#ifdef _WIN32
    _putenv_s("RLE_DIR", "");
#else
    unsetenv("RLE_DIR");
#endif

    bool res = createFileInRleDir("newFile");

    EXPECT_FALSE(res);
}

int main(int argc, char** argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

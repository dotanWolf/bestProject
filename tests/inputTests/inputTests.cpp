#include <gtest/gtest.h>
#include <sstream>
#include "input.h"

TEST(InputTests, ReadsNormalLine) {
    std::istringstream iss("HELLO\n");
    EXPECT_EQ(getInputFromStream(iss), "HELLO");
}

TEST(InputTests, ReadsLineWithSpaces) {
    std::istringstream iss("hello world test\n");
    EXPECT_EQ(getInputFromStream(iss), "hello world test");
}

TEST(InputTests, ReturnsEmptyOnEOF) {
    std::istringstream iss("");
    EXPECT_EQ(getInputFromStream(iss), "");
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
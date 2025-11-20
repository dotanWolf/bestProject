#include <gtest/gtest.h>
#include <vector>
#include "main.h"

TEST(validArguments, wrongCommand) {
    EXPECT_EQ(validParseForAdd("addd newFile aabbbddd"), false);
    EXPECT_EQ(validParseForAdd("afdjkl newFile aabbbddd"), false);
    EXPECT_EQ(validParseForAdd("a newFile aabbbddd"), false);
}

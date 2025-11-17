#include "parse.h"
#include <gtest/gtest.h>
#include <vector>

TEST(validArguments, wrongCommand) {
    EXPECT_EQ(validParseForAdd("addd newFile aabbbddd"), false);
    EXPECT_EQ(validParseForAdd("afdjkl newFile aabbbddd"), false);
    EXPECT_EQ(validParseForAdd("a newFile aabbbddd"), false);
}

TEST(validArguments, invalidParamaterNumber) {
    EXPECT_EQ(validParseForAdd("add newFile"), false);
    EXPECT_EQ(validParseForAdd("add newFile aabbbddd cccccdddaaa"), true);
    EXPECT_EQ(validParseForAdd("add"), false);
    EXPECT_EQ(validParseForAdd("addd newFile"), false);
    EXPECT_EQ(validParseForAdd("newFile dfksdf"), false);
}

TEST(validArguments, validCases) {
    EXPECT_EQ(validParseForAdd("add newFile aabbbddd"), true);
    EXPECT_EQ(validParseForAdd("add output aabbbddd%^&*%^a"), true);
    EXPECT_EQ(validParseForAdd("add newFile jklrsgdioh89032890gkln"), true);
}

TEST(parseArguments, edgeCase) {
    EXPECT_EQ(RLEcompress(""), false);
}

TEST(parseArguments, validCases) {
    std::vector<std::string> test1 = {"newFile", "aabbbddd"};
    std::vector<std::string> test2 = {"output", "aabbbddd%^&*%^a"};
    std::vector<std::string> test3 = {"newFile", "jklrsgdioh89032890gkln"};
    std::vector<std::string> test4 = {"newFile", "aabbbddd cccccdddaaa"};

    EXPECT_EQ(validParseForAdd("add newFile aabbbddd"), test1);
    EXPECT_EQ(validParseForAdd("add output aabbbddd%^&*%^a"), test2);
    EXPECT_EQ(validParseForAdd("add newFile jklrsgdioh89032890gkln"), test3);
    EXPECT_EQ(validParseForAdd("add newFile aabbbddd cccccdddaaa"), test4);
}


int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}


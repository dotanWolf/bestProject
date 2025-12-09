#include <gtest/gtest.h>
#include <sstream>
#include <iostream>
#include "output.h"

TEST(OutputTests, WritesToCustomStream) {
    std::stringstream ss;
    setThreadOutputStream(&ss);

    printOutput(std::cout, "Hello");
    EXPECT_EQ(ss.str(), "Hello");
}

TEST(OutputTests, AppendsMultipleWrites) {
    std::stringstream ss;
    setThreadOutputStream(&ss);

    printOutput(std::cout, "A");
    printOutput(std::cout, "B");
    EXPECT_EQ(ss.str(), "AB");
}

TEST(OutputTests, ResetToStdout) {
    std::stringstream ss;
    setThreadOutputStream(&ss);

    printOutput(std::cout, "Test");
    EXPECT_EQ(ss.str(), "Test");

    // Reset
    setThreadOutputStream(nullptr);

    printOutput(std::cout, "X");

    EXPECT_EQ(ss.str(), "Test"); // unchanged
}

TEST(OutputTests, GetThreadOutputReturnsCorrectStream) {
    std::stringstream ss;
    setThreadOutputStream(&ss);
    EXPECT_EQ(&getThreadOutputStream(), &ss);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
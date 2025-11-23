#include <gtest/gtest.h>
#include "ICompressor.h"
#include "RLECompressor.h"

TEST(compressionTest, basicStrings) {
    ICompressor* compressor = new RLECompressor();
    EXPECT_EQ(compressor -> compress("a"), "1a");
    EXPECT_EQ(compressor -> compress("aa"), "2a");
    EXPECT_EQ(compressor -> compress("ab"), "1a1b");
}

TEST(compressionTest, longerStrings) {
    ICompressor* compressor = new RLECompressor();
    EXPECT_EQ(compressor -> compress("aaaaa"), "5a");
    EXPECT_EQ(compressor -> compress("abaaabbbcca"), "1a1b3a3b2c1a");
    EXPECT_EQ(compressor -> compress("aabddccdbbbaaaa"), "2a1b2d2c1d3b4a");
}

TEST(compressionTest, edgeCases) {
    ICompressor* compressor = new RLECompressor();
    EXPECT_EQ(compressor -> compress(""), "");
    EXPECT_EQ(compressor -> compress("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), "34a");
    EXPECT_EQ(compressor -> compress("abdefghijklmnopqrstuvwyz"), "1a1b1d1e1f1g1h1i1j1k1l1m1n1o1p1q1r1s1t1u1v1w1y1z");
}

TEST(compressionTest, mixOfAllAsciiLetters) {
    ICompressor* compressor = new RLECompressor();
    EXPECT_EQ(compressor -> compress("$%$%*())))&&%"), "1$1%1$1%1*1(4)2&1%");
    EXPECT_EQ(compressor -> compress("\n\n\n34333IU66677"), "3\n1314331I1U3627");
    EXPECT_EQ(compressor -> compress("HHIOPGGGGG09)))hjgklllPjIPg))(&HJKO@)"), "2H1I1O1P5G10193)1h1j1g1k3l1P1j1I1P1g2)1(1&1H1J1K1O1@1)");
    
}
int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}


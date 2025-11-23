#include <gtest/gtest.h>
#include <iostream>
#include "parse.h"
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include "addCommand.h"
#include "ICommand.h"
#include "ICompressor.h"
#include "RLECompressor.h"
using namespace std;

TEST(DeCompressTest, decompress){
   ICompressor* compressor = new RLECompressor();
   EXPECT_EQ(compressor -> decompress("1A"), "A");
   EXPECT_EQ(compressor -> decompress("1A2b"), "Abb");
   EXPECT_EQ(compressor -> decompress("2a3B1c4D"), "aaBBBcDDDD");
   EXPECT_EQ(compressor -> decompress("9a9a"), "aaaaaaaaaaaaaaaaaa");
   EXPECT_EQ(compressor -> decompress("35142a"), "5554aa");
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

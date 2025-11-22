#include <gtest/gtest.h>
#include <iostream>
#include "parse.h"
#include "compress.h"
#include "create.h"
#include "save.h"
#include <cstdlib>
#include <vector>
#include "addCommand.h"
#include "ICommand.h"
#include "decompress.h"

using namespace std;

TEST(DeCompressTest, decompress){
   EXPECT_EQ(RLEdecompress("1A"), "A");
EXPECT_EQ(RLEdecompress("1A2b"), "Abb");
   EXPECT_EQ(RLEdecompress("2a3B1c4D"), "aaBBBcDDDD");
   EXPECT_EQ(RLEdecompress("9a9a"), "aaaaaaaaaaaaaaaaaa");
   EXPECT_EQ(RLEdecompress("35142a"), "5554aa");
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

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
#include "load.h"

using namespace std;

TEST(loadTests, retFileContent){
    ASSERT_TRUE(insertTextToFile("AAAAAAAABBBB", "newFile"));
    EXPECT_EQ(retFileContent("newFile"),"AAAAAAAABBBB");
    ASSERT_TRUE(insertTextToFile("jfkdlksjglk    jsfjkls", "newFile"));
    EXPECT_EQ(retFileContent("newFile"),"jfkdlksjglk    jsfjkls");    
    ASSERT_TRUE(insertTextToFile("\n\n\naaaaa\n", "newFile"));
    EXPECT_EQ(retFileContent("newFile"),"\n\n\naaaaa\n");    
    ASSERT_TRUE(insertTextToFile("fjsdklfjask   \n54832", "newFile"));
    EXPECT_EQ(retFileContent("newFile"),"fjsdklfjask   \n54832");
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

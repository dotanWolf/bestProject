#ifndef CREATE_H
#define CREATE_H
#define ENV_VAR "RLE_DIR"
#include <string>

//Creating new files in the directory given by RLE_DIR
// returns true if succeceds false if the file already exists or if failed to create
bool createFileInRleDir(const std::string& fileName);
#endif
#ifndef DELETE_FILE_H
#define DELETE_FILE_H
#define ENV_VAR "RLE_DIR"
#include <string>

bool deleteFile(const std::string& file_name);
bool checkFileExists(const std::string& fileName);
#endif
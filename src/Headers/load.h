//Reading a file's content from disk
//expected for get command
#ifndef LOAD_H
#define LOAD_H
#include <string>
#include <vector>
#include <optional>

// this function recieves a file name and returns its content if the file exists in RLE_DIR
// and std::nullopt otherwise
std::optional<std::string> retFileContent(const std::string& file_name);


// std::vector<std::string> retListOfFileNames(const std::string& decompressedText);

#endif

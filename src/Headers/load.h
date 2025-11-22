//Reading a file's content from disk
//expected for get command
#ifndef LOAD_H
#define LOAD_H

#include <string>
#include <vector>
std::string retFileContent(const std::string& decompressed_text);
std::vector<std::string> retListOfFileNames(const std::string& decompressedText);

#endif

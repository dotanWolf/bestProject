//Reading a file's content from disk
//expected for get command
#ifndef LOAD_H
#define LOAD_H

#include <string>
string retFileContent(const string& decompressed_text);
std::vector<std::string> retListOfFileNames(const std::string& decompressedText);

#endif

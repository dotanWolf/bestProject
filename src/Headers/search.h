//Searching through all files for specific content after decompression
//expected for search command
#ifndef SEARCH_H
#define SEARCH_H
#include <string>
#include <vector>

std::vector<std::string> FindFilesByContent(const std::string& content);

#endif

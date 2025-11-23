#ifndef SAVE_H
#define SAVE_H
#include <string>

// this function gets a string and a existing file's name that is inside the RLE_DIR
// directory and makes the content of the file the string
// if the file doesnt exist return false otherwise true
bool insertTextToFile(std::string text, std::string fileName);

#endif
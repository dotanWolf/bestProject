#ifndef SAVE_H
#define SAVE_H
#include <string>

// this function gets a string and a existing file's name that is inside the RLE_DIR
// directory and makes the content of the file the string
// if the file doesnt exist return false otherwise true
enum class FileSaveStatus {
    SUCCESS,
    ERROR_ENV_VAR_MISSING,
    ERROR_FAILED_TO_OPEN_WRITE, // File existed or was created, but writing failed
    ERROR_FILE_NOT_EXISTS
};
FileSaveStatus insertTextToFile(const std::string& text, const std::string& fileName);

#endif
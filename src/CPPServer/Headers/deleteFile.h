#ifndef DELETE_FILE_H
#define DELETE_FILE_H
#define ENV_VAR "RLE_DIR"
#include <string>
enum class FileDeletionStatus {
    SUCCESS,
    ERROR_FILE_NOT_FOUND,
    ERROR_DELETION_FAILED // File existed, but couldn't be removed 
};
FileDeletionStatus deleteFile(const std::string& file_name);
bool checkFileExists(const std::string& fileName);
#endif
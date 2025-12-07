#ifndef CREATE_H
#define CREATE_H
#define ENV_VAR "RLE_DIR"
#include <string>

//Creating new files in the directory given by RLE_DIR
// returns true if succeceds false if the file already exists or if failed to create
// In create.h

enum class FileCreationStatus {
    SUCCESS,
    ERROR_ENV_VAR_MISSING,
    ERROR_FILE_EXISTS,
    ERROR_FAILED_TO_OPEN
};

// Update the function signature in create.h:
FileCreationStatus createFileInRleDir(const std::string& fileName);
#endif
#include "save.h"
#include <string>
#include <fstream>
#include "create.h"

FileSaveStatus insertTextToFile(const std::string& text, const std::string& fileName) {
    const char* env_var_path = getenv(ENV_VAR);
    if (!env_var_path) {
        return FileSaveStatus::ERROR_ENV_VAR_MISSING; // Server configuration error
    }
    std::string fullPath = std::string(env_var_path) + "/" + fileName;
    std::ofstream out(fullPath); // create a stream to the path of the file
    if (!out) {
        // operation failed
        return FileSaveStatus::ERROR_FAILED_TO_OPEN_WRITE;
    }
    out << text;
    if (out.fail()) {
        out.close();
        return FileSaveStatus::ERROR_FAILED_TO_OPEN_WRITE; 
    }
    
    out.close();
    return FileSaveStatus::SUCCESS;
}
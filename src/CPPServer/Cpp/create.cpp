#include "create.h"
#include <cstdlib> 
#include <filesystem>  
#include <fstream>  
#include <iostream>
namespace fs = std::filesystem;

FileCreationStatus createFileInRleDir(const std::string& fileName) {
    const char* env = std::getenv(ENV_VAR);    // Fetch environment variable containing the directory path
    if (!env) {
       return FileCreationStatus::ERROR_ENV_VAR_MISSING;  
    }
    
    fs::path dirPath(env);
    fs::path fullPath = dirPath / fileName;

    if (std::filesystem::exists(fullPath)) {
        return FileCreationStatus::ERROR_FILE_EXISTS;    // Do not overwrite existing file
    }
    
    std::ofstream file(fullPath, std::ios::binary | std::ios::binary);
    if (!file.is_open()) {
      return FileCreationStatus::ERROR_FAILED_TO_OPEN;   // Failed to create file
    }

    file.close();
    return FileCreationStatus::SUCCESS;
}

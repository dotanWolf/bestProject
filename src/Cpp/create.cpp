#include "create.h"
#include <cstdlib> 
#include <filesystem>  
#include <fstream>  
#include <iostream>
namespace fs = std::filesystem;

bool createFileInRleDir(const std::string& fileName){
    const char* env = std::getenv(ENV_VAR);    // Fetch environment variable containing the directory path
    if (!env) {
        return false;  
    }
    
    fs::path dirPath(env);
    fs::path fullPath = dirPath / fileName;

    if (std::filesystem::exists(fullPath)) {
        return false;    // Do not overwrite existing file
    }
    
    std::ofstream file(fullPath, std::ios::binary | std::ios::binary);
    if (!file.is_open()) {
        return false;   // Failed to create file
    }

    file.close();
    return true;
}

#include "create.h"
#include <cstdlib> 
#include <filesystem>  
#include <fstream>  
namespace fs = std::filesystem;

bool createFileInRleDir(const std::string& fileName){
    const char* env = std::getenv("RLE_DIR");
    if (!env) {
        return false;  
    }

    fs::path dirPath(env);
    fs::path fullPath = dirPath / fileName;

    std::ofstream file(fullPath, std::ios::binary | std::ios::trunc);
    if (!file.is_open()) {
        return false;   // Failed to create file
    }

    file.close();
    return true;
}
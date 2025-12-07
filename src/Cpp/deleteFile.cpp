 #include "deleteFile.h"
 #include <vector>
 #include <string>
 #include "create.h"
 #include <cstdlib>
 #include <optional>
 #include <filesystem>
 #include <fstream>
 
 using namespace std;
 namespace fs = std::filesystem;
 bool deleteFile(const std::string& file_name) {
    
    const char* env = std::getenv(ENV_VAR);
    if (!env) {
        return false; 
    }
    
    fs::path dirPath(env);
    fs::path fullPath = dirPath / file_name;
    bool wasDeleted = fs::remove(fullPath);
    return wasDeleted;
}

bool checkFileExists(const std::string& fileName) {
    
    const char* env = std::getenv(ENV_VAR);
    if (!env) {
        // If the environment variable isn't set, the file cannot exist.
        return false; 
    }
    
    fs::path dirPath(env);
    fs::path fullPath = dirPath / fileName;

    // 4. Check Existence
    bool exists = fs::exists(fullPath);

    
    return exists;
} 
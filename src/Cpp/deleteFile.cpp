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

 FileDeletionStatus deleteFile(const std::string& file_name) {
    const char* env = std::getenv(ENV_VAR);
    if (!env) {
        // Server configuration failure
        return FileDeletionStatus::ERROR_DELETION_FAILED; 
    }
    fs::path dirPath(env);
    fs::path fullPath = dirPath / file_name;
    // 4. Check Existence (Crucial for determining 404 vs 500)
    if (!fs::exists(fullPath)) {
        return FileDeletionStatus::ERROR_FILE_NOT_FOUND;
    }

    // 5. Attempt Deletion
    try {
        if (fs::remove(fullPath)) {
            return FileDeletionStatus::SUCCESS;
        } else {
            // File existed, but fs::remove failed 
            return FileDeletionStatus::ERROR_DELETION_FAILED;
        }
    } catch (const fs::filesystem_error& e) {
        return FileDeletionStatus::ERROR_DELETION_FAILED;
    }
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
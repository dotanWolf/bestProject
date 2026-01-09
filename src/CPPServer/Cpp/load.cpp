 //This file will contain the functionality required to load and return decompressed file contents for the `get` command.
 #include "load.h"
 #include <vector>
 #include <string>
 #include "create.h"
 #include <cstdlib>
 #include <optional>
 #include <filesystem>
 #include <fstream>
 
 using namespace std;
namespace fs = std::filesystem;

FileRetrievalStatus retFileContent(const string& file_name, std::string& content_out) {
    const char* env_var_path = getenv(ENV_VAR);
    if (!env_var_path) {
        return FileRetrievalStatus::ERROR_READ_FAILURE; 
    }
    
    fs::path filePath = fs::path(env_var_path) / file_name;

    if (!fs::exists(filePath)) {
        return FileRetrievalStatus::ERROR_FILE_NOT_FOUND;
    }

    // Open file stream
    ifstream in(filePath, ios::in | ios::binary);
    if (!in.is_open()) {
        return FileRetrievalStatus::ERROR_READ_FAILURE; 
    }
    
    ostringstream buffer;
    buffer << in.rdbuf();
    content_out = buffer.str(); 
    
    in.close();

  
    return FileRetrievalStatus::SUCCESS;
}

// vector<string> retListOfFileNames(const string& decompressedText) {
//     vector<string> vector;
//     return vector;
// }


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

optional<string> retFileContent(const string& file_name) {
    const char* env_var_path = getenv(ENV_VAR);
    std::filesystem::path filePath = std::filesystem::path(env_var_path) / file_name;
    ifstream in(filePath); // create a stream to the path of the file
    if (!in) {
        return nullopt; // Return empty string on failure
    }
    ostringstream buffer;
    buffer << in.rdbuf();
    return buffer.str();    
}


// vector<string> retListOfFileNames(const string& decompressedText) {
//     vector<string> vector;
//     return vector;
// }


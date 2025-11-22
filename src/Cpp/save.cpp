#include "save.h"
#include <string>
#include <fstream>
#include "create.h"

bool insertTextToFile(std::string text, std::string fileName) {
    const char* env_var_path = getenv(ENV_VAR);
    std::string path = std::string(env_var_path) + "/" + fileName;
    std::ofstream out(path); // create a stream to the path of the file
    if (!out) {
        // operation failed
        return false;
    }
    out << text;
    out.close();
    return true;

}
#include "saving.h"
#include <string>
#include <fstream>

bool insertTextToFile(std::string text, std::string path) {
    std::ofstream:: out(path); // create a stream to the path of the file
    if (!out) {
        // operation failed
        return false;
    }
    out << text;
    out.close();
    return true;

}
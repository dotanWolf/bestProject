#include "create.h"
#include <filesystem>
#include <fstream>
#include <cstdlib>   // std::getenv
#include <string>

namespace fs = std::filesystem;

bool createFileInRleDir(const std::string& fileName)
{
    try {
        const char* dirEnv = std::getenv("RLE_DIR");
        if (dirEnv == nullptr || *dirEnv == '\0') {
            // RLE_DIR not set
            return false;
        }

        fs::path baseDir(dirEnv);

        if (!fs::exists(baseDir) || !fs::is_directory(baseDir)) {
            return false;
        }

        fs::path filePath = baseDir / fileName;

        std::ofstream out(filePath, std::ios::binary | std::ios::trunc);
        return out.is_open();
    }
    catch (const std::exception&) {
        return false;
    }
}

//Reading a file's content from disk
//expected for get command
#ifndef LOAD_H
#define LOAD_H
#include <string>
#include <vector>
#include <optional>

enum class FileRetrievalStatus {
    SUCCESS,
    ERROR_FILE_NOT_FOUND,
    ERROR_READ_FAILURE, // I/O or permission error while reading
    ERROR_DECOMPRESSION_FAILURE // If RLE data is corrupt
};

// this function recieves a file name and returns its content if the file exists in RLE_DIR
// and std::nullopt otherwise
FileRetrievalStatus retFileContent(const std::string& file_name, std::string& content_out);

// std::vector<std::string> retListOfFileNames(const std::string& decompressedText);

#endif

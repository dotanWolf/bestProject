#ifndef ICOMPRESSOR_H
#define ICOMPRESSOR_H

#include <string>

class ICompressor {
    public:
    virtual std::string compress(std::string inputString) = 0;
    virtual std::string decompress(std::string inputString) = 0;
};
#endif
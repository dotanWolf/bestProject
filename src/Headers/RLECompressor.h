#ifndef RLE_COMPRESSOR_H
#define RLE_COMPRESSOR_H

#include <string>
#include "ICompressor.h"

class RLECompressor : public ICompressor {
    public:
    std::string compress(std::string inputString) override;
    std::string decompress(std::string inputString) override;
};

#endif 
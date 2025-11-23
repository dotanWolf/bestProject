#include <string>

class ICompressor {
    public:
    virtual std::string compress(std::string inputString) = 0;
    virtual std::string decompress(std::string inputString) = 0;
};
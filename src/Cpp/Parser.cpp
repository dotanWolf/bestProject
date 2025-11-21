#include <string>

class Parser {
    public:
        static std::string getFirstWord(std::string str) {
            size_t spaceIndex = str.find(' ');
            if(spaceIndex != std::string::npos) {
                return str.substr(0, spaceIndex);
            }
            return nullptr;
        }

    private:
};
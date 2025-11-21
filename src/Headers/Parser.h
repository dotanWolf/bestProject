#ifndef PARSER_H
#define PARSER_H

#include <string>
#include <vector>

class Parser {
    public:
    // thid function recieves a stringg and returns the substring that starts at the beginning and ends at the first space
    // if no space exist return null
    static std::string getFirstWord(std::string str);   
};

#endif

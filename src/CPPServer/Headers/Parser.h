#ifndef PARSER_H
#define PARSER_H

#include <string>
#include <vector>

class Parser {
    public:
    // thid function recieves a string and returns the substring that starts at the beginning and ends at the first space
    // if no space exist return the entire word
    static std::string getFirstWord(std::string str);   
};

#endif

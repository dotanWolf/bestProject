#include "compress.h"
#include <iostream>

std::string RLEcompress(std::string input) {
     if (input.empty()) {
        return "";
    }
    std::string result;
    char current = input[0];
    std::size_t count = 1;
     for (std::size_t i = 1; i < input.size(); ++i) {
        if (input[i] == current) {
            ++count;
        } else {
            result += std::to_string(count);
            result += current;

            current = input[i];
            count = 1;
        }
    }
    result += std::to_string(count);
    result += current;

    return result;
}
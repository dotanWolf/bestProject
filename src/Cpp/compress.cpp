#include "compress.h"
#include <iostream>

using namespace std;

string RLEcompress(string input) {
     if (input.empty()) {
        return "";
    }
    string result;
    char current = input[0];
    size_t count = 1;
     for (size_t i = 1; i < input.size(); ++i) {
        if (input[i] == current) {
            ++count;
        } else {
            result += to_string(count);
            result += current;

            current = input[i];
            count = 1;
        }
    }
    result += to_string(count);
    result += current;

    return result;
}


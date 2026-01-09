#include <string>
#include <ICompressor.h>
#include <RLECompressor.h>

using namespace std;

std::string RLECompressor::compress(std::string inputString) {
    if (inputString.empty()) {
        return "";     // Empty input → empty output
    }
    string result;
    char current = inputString[0];
    int count = 1;
     for (int i = 1; i < inputString.size(); i++) {
        if (inputString[i] == current && count < 9) {
            count++; // Same character, increase the count
        } else {
            result += to_string(count);
            result += current;

            current = inputString[i];
            count = 1;
        }
    }
    result += to_string(count);
    result += current;

    return result;
}

std::string RLECompressor::decompress(std::string inputString) {
    string decompressedString = "";
    for (int i = 0; i < inputString.length(); i +=2) {
        int times = inputString.at(i) - '0';
        for (int j = 0; j < times; j++) {
            decompressedString +=  inputString.at(i + 1);
        }
    }
    return decompressedString;
}


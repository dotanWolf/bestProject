#include "decompress.h"
#include <string>
using namespace std;

//used probably for search and get commands by decompressing the text in the compressed files
string RLEdecompress(string input) {
    string decompressedString = "";
    for (int i = 0; i < input.length(); i +=2) {
        int times = input.at(i) - '0';
        for (int j = 0; j < times; j++) {
            decompressedString +=  input.at(i + 1);
        }
    }
    return decompressedString;
}

 //This file will contain the functionality required to load and return decompressed file contents for the `get` command.
 #include "load.h"
 #include "decompress.h"
 using namespace std;

string retFileContent(const string& file_name);
std::vector<std::string> retListOfFileNames(const std::string& decompressedText);


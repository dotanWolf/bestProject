//This header defines how your program prints results (for GET or SEARCH).
// Required for future exercises where input/output will NOT use the default standard streams.
#ifndef OUTPUT_H
#define OUTPUT_H

#include <string>

// prints the user output in any output stream
void printOutput(std::ostream& os, std::string userOutput);

#endif
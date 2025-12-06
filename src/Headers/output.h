//This header defines how your program prints results (for GET or SEARCH).
// Required for future exercises where input/output will NOT use the default standard streams.
#ifndef OUTPUT_H
#define OUTPUT_H

#include <string>

// prints the user output in any output stream
void printOutput(std::ostream& os, std::string userOutput);
// NEW: Function to set the destination stream for the current thread
void setThreadOutputStream(std::ostream* os_ptr);

// NEW: Function to get the destination stream for the current thread
std::ostream& getThreadOutputStream();
#endif
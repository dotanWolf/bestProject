//This header defines how your program receives commands.
// Required for future exercises where input/output will NOT use the default standard streams.
#ifndef INPUT_H
#define INPUT_H

#include <string>
// Function used for reciving input. This abstraction allows changing the input destination in future exercises.
// function recieves an input stream and outputs a string from that stream until the '\n' character
 std::string getInputFromStream(istream& is) {
#endif
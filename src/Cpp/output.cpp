// Function used for producing output. This abstraction allows changing the output destination in future exercises.
#include "output.h"
#include <iostream>

using namespace std;

void printOutput(std::ostream& os, std::string userOutput){
  os << userOutput;
}




//In the future we might refactor this function according to the instruction given on changing the ouput destination.
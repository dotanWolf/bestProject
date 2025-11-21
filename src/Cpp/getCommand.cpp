#include <vector>
#include <string>
#include "create.h"
#include <optional>
#include <cstdlib>
#include "ICommand.h"
#include "compress.h"
#include "save.h"
#include <sstream>
#include "getCommand.h"

void getCommand::execute(std::optional<std::vector<std::string>> arguments) {
   // Placeholder logic:
    // 1. Parse 'get [fileName]' from rawInput
    // 2. Load compressed content using getContent()
    // 3. Decompress the content (Missing RLE Decompress function)
    // 4. Print the result using printOutput()
}
std::optional<std::vector<std::string>> getCommand::isValid(std::string input) {
    return std::nullopt;
}
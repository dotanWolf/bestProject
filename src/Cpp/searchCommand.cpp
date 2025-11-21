#include <vector>
#include <string>
#include "create.h"
#include <optional>
#include <cstdlib>
#include "create.h"
#include "ICommand.h"
#include "compress.h"
#include "save.h"
#include <sstream>
#include "searchCommand.h"

void searchCommand::execute(std::optional<std::vector<std::string>> arguments) {
    // Placeholder logic:
    // 1. Parse 'search [pattern]' from rawInput
    // 2. Iterate through all files in RLE_DIR
    // 3. For each file, load, decompress, and search for the pattern.
    // 4. Print results using printOutput()
}
std::optional<std::vector<std::string>> searchCommand::isValid(std::string input) {
    return std::nullopt;
}
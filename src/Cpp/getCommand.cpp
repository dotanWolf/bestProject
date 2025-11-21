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
#include "getCommand.h"

void getCommand::execute(std::optional<std::vector<std::string>> arguments) {

}
std::optional<std::vector<std::string>> getCommand::isValid(std::string input) {
    return std::nullopt;
}
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

class searchCommand : public ICommand{
    public:
    void execute(std::vector<std::string>) {

    }
    std::optional<std::vector<std::string>> isValid(std::string input) {
                return std::nullopt;

    }
};
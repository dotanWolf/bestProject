#include <vector>
#include <string>
#include <optional>

class ICommand {
    // private:
    //     std::string input;
    public:
        // constructer that builds the object with the original string the user entered
        // ICommand(std::string input): input(input) {}
        // exeuctes the command, must be overriden by the commands subclass
        virtual void execute(std::optional<std::vector<std::string>>) = 0;
        // validates this -> input based on the commands subclass requirements
        // also returns the arguments if the command is valid and null otherwise
        virtual std::optional<std::vector<std::string>> isValid(std::string input) = 0;
};
#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>
#include <vector>
#include <optional>
#include "ICompressor.h"
class ICommand {
    private:
    // a compressor used by the execute method
    ICompressor* compressor;
    public:
    virtual void execute(std::optional<std::vector<std::string>>) = 0;
    virtual std::optional<std::vector<std::string>> isValid(std::string input) = 0;
    virtual void setCompressor(ICompressor* compressor);
    virtual ICompressor* getCompressor();
};

#endif
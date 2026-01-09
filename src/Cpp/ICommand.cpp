#include <vector>
#include <string>
#include <optional>
#include "ICompressor.h"
#include "ICommand.h"

void ICommand::setCompressor(ICompressor* compressor) {
    this -> compressor = compressor;
}

ICompressor* ICommand::getCompressor() {
    return this -> compressor;
}

#include "output.h"
#include <iostream>
#include <thread> // Required for thread_local

using namespace std;

thread_local std::ostream* thread_os_ptr = &std::cout;

void setThreadOutputStream(std::ostream* os_ptr) {
    // If the provided pointer is null, reset to console.
    if (os_ptr) {
        thread_os_ptr = os_ptr;
    } else {
        thread_os_ptr = &std::cout;
    }
}

std::ostream& getThreadOutputStream() {
    // Return the stream set for this thread, or fallback to std::cout if not set
    return *thread_os_ptr;
}

void printOutput(std::ostream& os, std::string userOutput) {
    *thread_os_ptr << userOutput;
    thread_os_ptr->flush();
}
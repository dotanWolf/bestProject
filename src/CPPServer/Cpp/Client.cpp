#include <iostream>     // For std::cout, std::cin
#include <string>       // For std::string
#include <cstring>      // For memset, strlen
#include <sys/socket.h> // For socket, connect, send, recv, AF_INET, SOCK_STREAM
#include <netinet/in.h> // For sockaddr_in, htons
#include <arpa/inet.h>  // For inet_addr
#include <cstdio>       
#include <cstdlib>      
#include <unistd.h>
#include "input.h" 

// Use the standard namespace to simplify code
using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 3) {
        //cerr << "Usage: " << argv[0] << " <ServerIP> <PortNumber>" << endl;
        return 1;
    }

    const char* ip_address = argv[1];
    const int port_no = std::stoi(argv[2]);

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        //perror("Error creating socket");
        return 1;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port_no);

    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        //perror("Error connecting to server");
        close(sock);
        return 1;
    }
    
    //cout << "Connected to server. Type command:" << endl;

    while (true) {
        string userInput = getInputFromStream(cin);
        
        if (userInput.empty()) {
            continue;
        }

        // Most line-based server protocols expect a newline to signal end-of-command.
        string messageToSend = userInput + "\n";
        
        int sent_bytes = send(sock, messageToSend.c_str(), messageToSend.length(), 0);

        if (sent_bytes < 0) {
            //perror("Error sending message");
            break;
        }

        char buffer[4096];
        memset(buffer, 0, sizeof(buffer)); // Ensure buffer is clear
        
        // Recieve message from server
        int read_bytes = recv(sock, buffer, sizeof(buffer) - 1, 0); // Leave space for null terminator
        
        if (read_bytes == 0) {
            //cout << "Server closed connection." << endl;
            break;
        }
        else if (read_bytes < 0) {
            //perror("Error receiving message");
            break;
        }
        else {
            // FIX: Null-terminate the buffer safely before printing 
            buffer[read_bytes] = '\0';
            cout << buffer;
        }
    }
    
    close(sock);
    return 0;
}
int main(int argc, char* argv[]) {
    // argv[1] will be the servers ip, argv[2] will be the port the server is listening to
    // an ip number that represents our computer
    const char* ip_address = argv[1];
    // the servers port number
    const int port_no = argv[2];

    // create a socket object in order to pass data to the os which does the ipc
    // the arguments mean the socket works on ip version 4, and with the TCP protocol
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
    }
    // create a struct for the servers address
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    // put the ip address as the one we set before
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port_no);

    // connect to the server
    if (connect(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error connecting to server");
    }

    while (true) {
        string userInput = getInputFromStream(cin);
        int data_len = strlen(userInput);
        // send the message
        int sent_bytes = send(sock, userInput, data_len, 0);

        if (sent_bytes < 0) {
        // error
        }

        char buffer[4096];
        int expected_data_len = sizeof(buffer);
        // recieve message from server
        int read_bytes = recv(sock, buffer, expected_data_len, 0);
        if (read_bytes == 0) {
        // connection is closed
        }
        else if (read_bytes < 0) {
        // error
        }
        else {
            cout << buffer;
        }
    }
    return 0;
}
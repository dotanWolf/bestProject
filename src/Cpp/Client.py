import socket
import sys

# create a socket object in order to pass data to the os which does the ipc
# the arguments mean the socket works on ip version 4, and with the TCP protocol
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# an ip number that represents our computer
dest_ip = sys.argv[1]
# the servers port number
dest_port = sys.argv[2]
s.connect((dest_ip, dest_port))
# get input from the user
while true:
    msg = input()
    # send to the server
    s.send(bytes(msg, 'utf-8'))
    # recieve data from the server
    data = s.recv(4096)
    # print what the server said after decoding
    print("Server sent: ", data.decode('utf-8'))
    # get another message from the user
import socket
import sys

if len(sys.argv) != 3:
    #print("Usage: python Client.py <ServerIP> <PortNumber>")
    sys.exit(1)

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    dest_ip = sys.argv[1]
    dest_port = int(sys.argv[2])
    s.connect((dest_ip, dest_port))
except ValueError:
    #print("Error: Invalid port number.")
    sys.exit(1)
except socket.error as e:
    #print(f"Error connecting to server at {dest_ip}:{dest_port}: {e}")
    sys.exit(1)

#print("Connected. Type commands (e.g., GET filename).")

while True:
    try:
        msg = input("") 
        
        if not msg:
            continue

        s.sendall(bytes(msg + '\n', 'utf-8'))
        
        data = s.recv(4096)
        
        if not data:
           # print("Server closed the connection.")
            break
            
        print(data.decode('utf-8').strip())

    except EOFError:
        #print("\nExiting client.")
        break
    except socket.error as e:
        #print(f"\nSocket error: {e}")
        break
    except Exception as e:
       # print(f"An unexpected error occurred: {e}")
        break

s.close()
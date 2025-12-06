# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -f tests/serverTests/Dockerfile -t servertests-tests .

# then run it using: docker run servertests-tests

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Copy the ENTIRE project into the container
COPY . /usr/src/myproject
ENV RLE_DIR=/app/data
RUN mkdir -p $RLE_DIR

# Move into the test folder
WORKDIR /usr/src/myproject/tests/serverTests/build

# Configure + build
RUN mkdir -p build
WORKDIR /usr/src/myproject/tests/serverTests/build
RUN cmake .. && make

CMD ["./runserverTests"]

# Start the server container in detached mode (-d)
# It runs the executable ServerMain on port 8080.
#docker run -d --name my-server server-client-app /usr/src/myproject/build/ServerMain 8080


# Run the client interactively (-it) so you can type commands.
# Arguments: [Server IP/Hostname] [Port]
#docker run -it --name my-client server-client-app /usr/src/myproject/build/Client my-server 8080
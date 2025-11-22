# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -f tests/parserTests/Dockerfile -t parser-tests .

# then run it using: docker run parser-tests

FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

# Copy the ENTIRE project into the container
COPY . /usr/src/myproject

# Move into the test folder
WORKDIR /usr/src/myproject/tests/parserTests/build

# Configure + build
RUN mkdir -p build
WORKDIR /usr/src/myproject/tests/parserTests/build
RUN cmake .. && make

CMD ["./runParserTests"]
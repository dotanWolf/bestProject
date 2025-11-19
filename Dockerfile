# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -t app .

# then run it using docker run -it -v C:/Users/user/Documents/dotan/AdvancedProgramming/project/bestProject:/app/data app

FROM gcc:latest

WORKDIR /app

# create the enviornment variable with the path

ENV RLE_DIR=/app/data

# Copy all source files including headers
COPY src/ src/

# Compile
RUN g++ -std=c++17 src/*.cpp -Isrc/Headers -o app

CMD ["./app"]


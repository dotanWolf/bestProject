# in order to build this dockerfile go to the root directory (bestProject)
# then run: docker build -t app .

# then run it using: docker run -it -v C:/Users/user/Documents/dotan/AdvancedProgramming/project/bestProject:/app/data app

FROM gcc:latest
RUN apt-get update && apt-get install -y cmake

# create the enviornment variable with the path
ENV RLE_DIR=/app/data

# Copy all source files including headers
COPY . /usr/src/myproject
WORKDIR /usr/src/myproject
RUN mkdir build
WORKDIR /usr/src/myproject/build
RUN cmake .. && make

CMD ["./MyProject"]


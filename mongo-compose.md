# Example 2 => For MongoDB

# services:

# backend:

# build:

# context: ./

# dockerfile: Dockerfile

# ports:

# - "3000:3000"

# environment:

# - MONGO_URI=mongodb://mongo:27019/dockerdb

# depends_on:

# - mongo

# volumes:

# - .:/app

# - /app/node_modules

# mongo:

# image: mongo:5.0

# container_name: mongo

# ports:

# - "27019:27019"

# volumes:

# - latestdb:/data/db

# volumes:

# latestdb:

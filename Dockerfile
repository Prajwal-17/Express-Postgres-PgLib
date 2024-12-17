# Use a lightweight Node.js image as the base
FROM node:18-alpine

# Set the working directory in docker, where all the files are stored 
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy code from the host machine to the /app directory
COPY . .

# Expose the port the app will listen on
EXPOSE 3000

# Start the app
CMD ["npm","run","dev"]
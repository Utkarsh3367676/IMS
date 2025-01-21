# Use official Node.js image as a base
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the frontend code
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight web server to serve the React app
RUN npm install -g serve

# Expose the port for the frontend
EXPOSE 3000

# Serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]

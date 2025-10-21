# Use Ubuntu 22.04 with Node.js 18 for better compatibility
FROM ubuntu:22.04

# Set working directory
WORKDIR /app

# Install Node.js 18, curl, build tools and other dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    python3 \
    make \
    g++ \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && curl https://install.meteor.com/ | sh

# Add Meteor to PATH
ENV PATH="/root/.meteor:${PATH}"

# Copy package files
COPY .meteor .meteor
COPY package*.json ./

# Copy source code
COPY . .

# Expose the default Meteor port
EXPOSE 3000

# Start the application
CMD ["meteor", "run", "--allow-superuser"]
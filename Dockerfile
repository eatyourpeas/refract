FROM node:22-bookworm-slim

# Reduce interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install required system packages (build tools for native modules + mongosh for startup script)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    build-essential \
    python3 \
    make \
    g++ \
    git \
    && npm install -g npm@latest \
    && curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg \
    && echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends mongodb-mongosh \
    && rm -rf /var/lib/apt/lists/*

# Install Meteor using the official installer (latest release)
RUN curl https://install.meteor.com/ | sed 's/--progress-bar/ /' | /bin/sh -s -- --release METEOR@latest

# Ensure meteor is on PATH
ENV PATH="/root/.meteor:${PATH}"

# Copy meteor tool manifest and package files first for caching installs
COPY .meteor .meteor
COPY package*.json ./

# Install project npm dependencies using Meteor's bundled npm.
RUN METEOR_ALLOW_SUPERUSER=1 meteor npm install --no-audit --no-fund

# Copy remaining project files
COPY . .

# Copy and prepare startup script
COPY scripts/start-meteor.sh /usr/local/bin/start-meteor.sh
RUN chmod +x /usr/local/bin/start-meteor.sh

# Allow building a production bundle during image build. Set build arg BUILD_BUNDLE=1 to enable.
ARG BUILD_BUNDLE=0
RUN if [ "$BUILD_BUNDLE" = "1" ]; then \
    echo "Building Meteor production bundle..."; \
    METEOR_ALLOW_SUPERUSER=1 meteor build --directory /tmp/bundle --server-only; \
    cd /tmp/bundle/programs/server && npm install --production; \
    mkdir -p /app/bundle && cp -a /tmp/bundle/. /app/bundle/; \
    else \
    echo "Skipping bundle build (BUILD_BUNDLE != 1)"; \
    fi

# Expose the default Meteor port
EXPOSE 3000

# Start Meteor using the startup script that waits for MongoDB user
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
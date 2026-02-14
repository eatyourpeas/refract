#!/usr/bin/env bash
set -euo pipefail

APP_ENV=${APP_ENV:-development}

if [ "$APP_ENV" = "production" ] && [ -d "/app/bundle" ]; then
  echo "Starting in production mode: running bundle main.js"
  cd /app/bundle
  # ensure programs/server deps are present
  if [ -d "programs/server" ]; then
    cd programs/server
    if [ -f package.json ]; then
      echo "Installing bundle server dependencies (if missing)"
      npm install --production --no-audit --no-fund || true
    fi
    cd /app/bundle
  fi
  exec node main.js
else
  echo "Starting in development mode via start-meteor.sh"
  exec /usr/local/bin/start-meteor.sh
fi

#!/bin/bash
set -e

echo "Waiting for MongoDB to be ready with user configured..."

# Wait for MongoDB to be reachable
until mongosh --host mongo:27017 --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  echo "Waiting for MongoDB to be available..."
  sleep 2
done

echo "MongoDB is up - waiting for user to be created..."

# Wait for the app user to exist and be able to authenticate
max_retries=90
retry_count=0

while [ $retry_count -lt $max_retries ]; do
  if mongosh "mongodb://${MONGO_APP_USER}:${MONGO_APP_PASS}@mongo:27017/refract?authSource=admin" --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo "Successfully authenticated as ${MONGO_APP_USER}"
    break
  fi
  
  retry_count=$((retry_count + 1))
  echo "Attempt $retry_count/$max_retries: User not ready yet, waiting..."
  sleep 3
done

if [ $retry_count -eq $max_retries ]; then
  echo "ERROR: User ${MONGO_APP_USER} not available after ${max_retries} attempts"
  exit 1
fi

echo "Starting Meteor application..."
exec meteor run --port 0.0.0.0:3000 --allow-superuser --verbose

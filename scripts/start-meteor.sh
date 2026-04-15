#!/bin/bash
# Do NOT use set -e or set -u here — the retry loop needs to survive non-zero exits from meteor run

echo "Waiting for MongoDB to be ready with user configured..."

# Wait for MongoDB to be reachable
until mongosh --host mongo:27017 --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  echo "Waiting for MongoDB to be available..."
  sleep 2
done

echo "MongoDB is up - waiting for user to be created..."

# Wait for the app user to exist and be able to authenticate
max_retries=180
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
# Try starting Meteor; on early failure (DB race) retry a few times before exiting
max_start_retries=12
start_attempt=0
while [ $start_attempt -lt $max_start_retries ]; do
  start_attempt=$((start_attempt + 1))
  echo "Starting Meteor (attempt $start_attempt/$max_start_retries)..."
  # run in foreground; if it exits with 0 we finish, otherwise retry after a delay
  METEOR_ALLOW_SUPERUSER=1 meteor run --port 0.0.0.0:3000 --allow-superuser --verbose
  rc=$?
  if [ $rc -eq 0 ]; then
    echo "Meteor exited normally (code 0)."
    exit 0
  fi
  echo "Meteor exited with code $rc; retrying after delay..."
  sleep 10
done

echo "Meteor failed to start after $max_start_retries attempts; exiting."
exit 1

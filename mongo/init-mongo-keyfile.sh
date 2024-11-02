#!/bin/bash
# Generate a key file for MongoDB replica set authentication

# Path where the key file will be stored in the container
KEYFILE_PATH="/data/configdb/mongo-keyfile"

# Generate the key file if it doesn't exist
if [ ! -f "$KEYFILE_PATH" ]; then
  echo "Generating MongoDB keyfile..."
  openssl rand -base64 756 > "$KEYFILE_PATH"
  chmod 600 "$KEYFILE_PATH"
  echo "Keyfile generated at $KEYFILE_PATH"
else
  echo "Keyfile already exists at $KEYFILE_PATH"
fi

mongod --replSet rs0 --bind_ip_all --port 27017 --keyFile /data/configdb/mongo-keyfile

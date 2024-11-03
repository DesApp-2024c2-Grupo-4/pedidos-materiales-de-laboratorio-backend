#!/bin/bash
# Generate a key file for MongoDB replica set authentication
if [ ! -f "$KEYFILE_PATH" ]; then
  echo "Generating MongoDB keyfile..."
  openssl rand -base64 756 > "$KEYFILE_PATH"
  chmod 600 "$KEYFILE_PATH"
  echo "Keyfile generated at $KEYFILE_PATH"
else
  echo "Keyfile already exists at $KEYFILE_PATH"
fi

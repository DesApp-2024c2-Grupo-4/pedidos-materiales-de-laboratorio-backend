#!/bin/bash
sleep 10

mongosh --host $MONGO_HOST --port $MONGO_PORT -u $MONGO_ROOT_USERNAME -p $MONGO_ROOT_PASSWORD --authenticationDatabase $MONGO_ROOT_DATABASE <<EOF
rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "127.0.0.1:27017" }
    ]
})
EOF

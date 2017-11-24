#!/usr/bin/env bash

echo "$(date) - starting: $@"

# Start the mongod server (command provided in docker-compose)
exec "$@" &

# check for a few known paths (to determine whether we've already initialized and should thus skip the rest of this script)
alreadyInitialized=
for path in \
  /data/db/WiredTiger \
  /data/db/journal \
  /data/db/local.0 \
  /data/db/storage.bson \
; do
  if [ -e "$path" ]; then
    alreadyInitialized="$path"
    break
  fi
done

if [ -z "$alreadyInitialized" ]; then
  # Wait for mongo1 to start
  while true; do
    echo "$(date) - connecting to $MONGO1HOST"
    mongo mongodb://$MONGO1HOST/ --eval "db.stats()" &>/dev/null
    RESULT=$? # 0 = success
    echo "$RESULT maybe"
    if [ $RESULT -eq 0 ]
    then
      break;
    fi
    sleep 1
  done

  echo "$(date) - mongo1 connected successfully"

  # Wait for mongo2 to start
  while true; do
    echo "$(date) - connecting to $MONGO2HOST"
    mongo mongodb://$MONGO2HOST/ --eval "db.stats()" &>/dev/null
    RESULT=$? # 0 = success
    if [ $RESULT -eq 0 ]
    then
      break;
    fi
    sleep 1
  done
  echo "$(date) - mongo2 connected successfully"

  # Wait for mongo3 to start
  while true; do
    echo "$(date) - connecting to $MONGO3HOST"
    mongo mongodb://$MONGO3HOST/ --eval "db.stats()" &>/dev/null
    RESULT=$? # 0 = success
    if [ $RESULT -eq 0 ]
    then
      break;
    fi
    sleep 1
  done
  echo "$(date) - mongo3 connected successfully"

  #Initiate
  mongo <<EOF
    var cfg = { 
      "_id": "example",
      "members": [
        { 
          "_id": 1, 
          host: "$MONGO1HOST" 
        }, 
        { 
          "_id": 2, 
          "host": "$MONGO2HOST" 
        }, 
        { 
          "_id": 3, 
          "host": "$MONGO3HOST" 
        }
      ], 
      "settings": { "getLastErrorDefaults": { "w": "majority", "wtimeout": 30000 }}};
      rs.initiate(cfg, { force: true });
EOF

  echo "$(date) - Waiting for replica sync"
  while [ "$RESULT" != "true" ]; do
    RESULT=$(mongo localhost --quiet --eval 'db.isMaster().ismaster');
    sleep 5;
    echo "$(date) - still waiting"
  done
  echo "$(date) - Replica sync completed successfully"

  echo "************************************************************Creating mongo users..."
  echo "Root: $ROOT_USERNAME"
  mongo admin  << EOF
    db.createUser(
      {
        user: '$ROOT_USERNAME', 
        pwd: '$ROOT_PASSWORD', 
        roles: [{role: 'root', db: 'admin'}]
      })
EOF
  echo "Application: $APPLICATION_USERNAME"
  mongo admin --host mongo1 -u $ROOT_USERNAME -p $ROOT_PASSWORD << EOF 
    use $APPLICATION_DATABASE
    db.createUser(
      {
        user: '$APPLICATION_USERNAME', 
        pwd: '$APPLICATION_PASSWORD', 
        roles: [{role: 'readWrite', db: '$APPLICATION_DATABASE'}]
      })
EOF
  echo "****Mongo users created....";
fi

  echo "$(date) done.";

wait $!
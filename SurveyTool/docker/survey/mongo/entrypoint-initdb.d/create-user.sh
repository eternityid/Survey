#!/usr/bin/env bash

# This file is used for dev machine creation of surveytool user

# The mongo docker image will create the root user for us because we have set
# MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD in environment.

echo "Application: $APPLICATION_USERNAME"
mongo admin -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD << EOF
    use $APPLICATION_DATABASE
    db.createUser(
        {
            user: '$APPLICATION_USERNAME', 
            pwd: '$APPLICATION_PASSWORD', 
            roles: [{role: 'readWrite', db: '$APPLICATION_DATABASE'}]
        })
EOF
echo "Mongo users created.";

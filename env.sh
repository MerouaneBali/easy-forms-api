#!/bin/bash

set -e
trap 'echo "******* FAILED *******" 1>&2' ERR

heroku config:set -a easy-forms-api EXPRESS_PORT=5000

heroku config:set -a easy-forms-api MAIN_DB_CONNECTION=mongodb+srv://main:w1NNeG!NqsX1!2Odznsp@main.4erfl.mongodb.net/Main?retryWrites=true&w=majority

heroku config:set -a easy-forms-api REDIS_AUTH_DB_HOST=redis-15410.c277.us-east-1-3.ec2.cloud.redislabs.com
heroku config:set -a easy-forms-api REDIS_AUTH_DB_PORT=15410
heroku config:set -a easy-forms-api REDIS_AUTH_DB_PASSWORD=vfO4q8TNUy3gylew2BVzkizjFZOMJF5O

heroku config:set -a easy-forms-api REDIS_UPDATES_DB_HOST=redis-12269.c135.eu-central-1-1.ec2.cloud.redislabs.com
heroku config:set -a easy-forms-api REDIS_UPDATES_DB_PORT=12269
heroku config:set -a easy-forms-api REDIS_UPDATES_DB_PASSWORD=a6fShh3W1tgRGA5f2U0QhLL7WbZUtzXy

heroku config:set -a easy-forms-api REDIS_EMAIL_VERIFICATION_DB_HOST=redis-18501.c8.us-east-1-4.ec2.cloud.redislabs.com
heroku config:set -a easy-forms-api REDIS_EMAIL_VERIFICATION_DB_PORT=18501
heroku config:set -a easy-forms-api REDIS_EMAIL_VERIFICATION_DB_PASSWORD=TfmBsnvhabwI9RZDindcpkYioFWcCdbJ

heroku config:set -a easy-forms-api REDIS_RESETS_DB_HOST=redis-10839.c135.eu-central-1-1.ec2.cloud.redislabs.com
heroku config:set -a easy-forms-api REDIS_RESETS_DB_PORT=10839
heroku config:set -a easy-forms-api REDIS_RESETS_DB_PASSWORD=HKJ6e3O7sLr95SjIgQEF5Zeuzx7Un8yC

heroku config:set -a easy-forms-api REDIS_LOGIN_TIMEOUT_DB_HOST=redis-10839.c135.eu-central-1-1.ec2.cloud.redislabs.com
heroku config:set -a easy-forms-api REDIS_LOGIN_TIMEOUT_DB_PORT=10839
heroku config:set -a easy-forms-api REDIS_LOGIN_TIMEOUT_DB_PASSWORD=HKJ6e3O7sLr95SjIgQEF5Zeuzx7Un8yC

heroku config:set -a easy-forms-api JWT_SECRET=7LdWo4MWoo4HIqfOOgq9eAfj^@Yt0E7N
heroku config:set -a easy-forms-api CRYPTO_SECRET=7LdWo4MWoo4HIqfOOgq9eAfj^@Yt0E7N
heroku config:set -a easy-forms-api SESSION_SECRET=7LdWo4MWoo4HIqfOOgq9eAfj^@Yt0E7N

heroku config:set -a easy-forms-api GMAIL_ACCOUNT_USERNAME=trulyonehappyboy@gmail.com
heroku config:set -a easy-forms-api GMAIL_ACCOUNT_PASSWORD=3H2^!v8E#qLQ

heroku config:set -a easy-forms-api  EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME=600
heroku config:set -a easy-forms-api  RESET_PASSWORD_TOKEN_EXPIRATION_TIME=600
heroku config:set -a easy-forms-api  AUTHORIZATION_TOKEN_EXPIRATION_TIME=7200
heroku config:set -a easy-forms-api  AUTHORIZATION_SESSION_EXPIRATION_TIME=3600000

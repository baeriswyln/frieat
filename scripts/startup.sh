#!/bin/sh
echo "Loading the websites..."
run-parts /etc/periodic/monthly
run-parts /etc/periodic/daily_6am

crond -L /app/crond.log
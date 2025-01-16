#!/bin/sh

domains="https://web.sv-restaurant.ch/menu/HEIA,%20Fribourg/Repas%20chauds"

# Get the current date in YYYY-MM-DD format
current_date=$(date +%Y-%m-%d)

# Get the weekday of the current date (1 = Monday, 7 = Sunday)
current_weekday=$(date +%u)

# Calculate the dates for Monday through Friday of the current week
for offset in $(seq $((1 - current_weekday)) $((5 - current_weekday))); do
    weekday_date=$(date -d "$current_date + $offset days" +%Y-%m-%d)
    weekday_name=$(date -d "$current_date + $offset days" +%A)

    for domain in "$domains"; do
        echo "wget -O /usr/local/apache2/htdocs/data/heia/$weekday_name.html $PLAYWRIGHT/html?url=$domain/date/$weekday_date&waitUntil=load&selector=.menu-wrapper >/dev/null 2>&1"
    done
done
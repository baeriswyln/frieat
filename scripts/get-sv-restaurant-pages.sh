#!/bin/sh

# Array of tuples. Every line is an entry in the array. Each line has two values, separated by a space.
# First value: Base URL pointing to the restaurant's page. Second value: folder name where to store the data.
domains="https://web.sv-restaurant.ch/menu/HEIA,%20Fribourg/Repas%20chauds heia
https://web.sv-restaurant.ch/menu/BKW%20Galgenfeld,%20Bern/Mittagsmenu%20Galgenfeld bkw"

base_folder="/usr/local/apache2/htdocs/data"

# Get the current date in YYYY-MM-DD format
current_date=$(date +%Y-%m-%d)

# Get the weekday of the current date (1 = Monday, 7 = Sunday)
current_weekday=$(date +%u)

# Iterate through all domains, and split the tuple into two variables.
echo "$domains" | while IFS=" " read -r url folder; do

    # As wget -O does not create folders, make sure the folder exists.
    if [ ! -d "$base_folder/$folder" ]; then
        mkdir -p "$base_folder/$folder"
    fi

    # Calculate the dates for Monday through Friday of the current week
    for offset in $(seq $((1 - current_weekday)) $((5 - current_weekday))); do
        weekday_date=$(date -d "$current_date + $offset days" +%Y-%m-%d)
        weekday_name=$(date -d "$current_date + $offset days" +%A)

        wget -O $base_folder/$folder/$weekday_name.html $PLAYWRIGHT/html?url=$url/date/$weekday_date\&waitUntil=load\&selector=app-category >/dev/null 2>&1
    done
done
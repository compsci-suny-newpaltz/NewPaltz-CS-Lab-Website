#!/bin/bash
email="$1"
nId="$2"

userName=$(echo "$email" | awk -F"@" '{print $1}')
pswd='S'$(echo "$nId" | awk -F'[^0-9]*' '$0=$2')

# need to make possible for database (researching online for how to do this)

SQL="CREATE USER IF NOT EXISTS '$userName'@'localhost' IDENTIFIED BY '$pswd';
GRANT ALL PRIVILEGES ON *.* TO '$userName'@'localhost';
FLUSH PRIVILEGES;"
mysql -u "$DB_USER" -p"$DB_PASS" -e "$SQL"
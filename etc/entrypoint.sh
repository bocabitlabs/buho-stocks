#!/bin/sh

# Function to check if MariaDB is reachable
check_db_connection() {
    nc -zv "$DB_HOSTNAME" "$DB_PORT" &> /dev/null
}

if [ "$DB_TYPE" = "mysql" ] || [ "$DB_TYPE" = "postgresql" ]; then
    echo 'Waiting for database...'
    while ! check_db_connection; do
        echo "Database is not reachable yet. Waiting 1 second..."
        sleep 1
    done
    echo 'Database started!'
fi

echo 'Load virtual env...'
. /usr/src/app/.venv/bin/activate
echo 'Virtual env loaded!'

echo 'Running migrations...'
python manage.py migrate
echo 'Migrations finished!'

echo 'Collecting static files...'
python manage.py collectstatic --no-input
echo 'Static files collected!'

echo 'Starting application now...'

exec "$@"

#! /usr/bin/env bash

# Let the DB migrate
. /usr/src/app/.venv/bin/activate
python manage.py migrate

---
sidebar_position: 4
---
# Using a Python virtual env on the host machine

Use a virtual environment:

```
python -m venv env
source env/bin/activate
```

## Update the config files and put them in the volumes

- `backend/config/config.sample.py`: Application's configuration.
- `backend/config/mysql.conf`: Database configuration

## Running the initial migrations

```bash
cd backend
python manage.py migrate
```

## Running the application

Backend:
```bash
cd backend
python manage.py runserver 0.0.0.0:8001
```

Frontend:
```bash
cd client
yarn start
```
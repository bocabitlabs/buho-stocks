---
sidebar_position: 4
---
# Using a Python virtual env on the host machine

## Backend

Use a virtual environment:

```bash
python -m venv env
```

```bash
source env/bin/activate
```

### Rename the config files and put them in the volumes

- `backend/config/config.sample.py`: Application's configuration.
  - Must be renamed to `config.py`
- `backend/config/mysql.sample.conf`: Database configuration in case you want to use Mysql.
  - Must be renamed to `mysql.conf`

### Install the dependencies

```
pip install -r requirement.txt
```

### Install the dev dependencies
```
pip install -r requirement.dev.txt
```

### Running the initial migrations

```
cd backend
```

```bash
python manage.py migrate
```

### Running the application's backend

Backend:
```bash
python manage.py runserver 0.0.0.0:8001
```

## Frontend

### Install the dependencies

```
cd client
```

```bash
yarn
```

### Running the application's frontend

```bash
yarn start
```
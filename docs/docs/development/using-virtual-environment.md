---
sidebar_position: 4
---
# Using a Python virtual env on the host machine

## Backend

Use a virtual environment:

```bash
poetry install
```

```bash
source ./venv/bin/activate
```

### Create a .env file

Create an `.env` on the root of the project by copying the content of `.env.sample` and populate its values to the desired ones.

### Install the dependencies

```
poetry install
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
yarn install
```

### Running the application's frontend

```bash
yarn start
```
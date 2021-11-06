# Buho Backend (WIP)

[![Django CI](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/django.yml/badge.svg)](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/django.yml) [![React CI](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/react.yml/badge.svg)](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/react.yml)

```bash
python3 -m venv ./env
source ./env/bin/activate
```

```bash
docker build . --tag buho-backend-docker
```

```bash
docker run --publish 8000:8000 --name buho-backend buho-backend-docker
```

```bash
docker-compose exec app python manage.py flush --no-input
```

```bash
docker-compose exec app python manage.py makemigrations
```

```bash
docker-compose exec app python manage.py migrate
```

## Dev

```bash
docker-compose build
```

```bash
docker-compose up --remove-orphans
```


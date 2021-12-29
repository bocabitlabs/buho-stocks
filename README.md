# Buho Backend (WIP)

[![Django CI](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/django.yml/badge.svg)](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/django.yml) [![React CI](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/react.yml/badge.svg)](https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/react.yml)


## Install

### 1. Configuring the volumes

Before starting, keep in mind that the application uses 2 volumes to persist the config and the uploads. Create a volume for each of these folders and map them to the following locations.

- `/usr/src/app/config`: Folder with the configuration files (application and DB)
- `/usr/src/media`: Folder for the uploads

### 2. Chosing a Database

- `sqlite`: Default configuration.
- `mysql`: Best configuration to prevent data loss. You will need to create the database manually and them point the configuration files to it.

### 3. Update the config files and put them in the volumes

- `backend/config/config.sample.py` -> `/usr/src/app/config/config.py`
- `backend/config/mysql.conf` -> `/usr/src/app/config/mysql.conf`



```bash
python3 -m venv ./env
source ./env/bin/activate
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


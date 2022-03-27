# Development environment

Either use Docker and Visual Studio Code container development or develop locally.

## Requirements

- Python 3.9
- Node 14
- Yarn 1.22

### Configuring the volumes

Before starting, keep in mind that the application uses 2 volumes to persist the config and the uploads. Create a volume for each of these folders and map them to the following locations.

- `/usr/src/app/config`: Folder with the configuration files (application and DB)
- `/usr/src/media`: Folder for the uploads

### Choosing a Database

- `sqlite`: Default configuration.
- `mysql`: Best configuration to prevent data loss. You will need to create the database manually and them point the configuration files to it.

The following commands can be ussed on Mac to install MariaDB.

```
brew install mariadb
sudo mysql_secure_installation
```

```
brew services start mariadb
```

```
brew services stop mariadb
```

### Update the config files and put them in the volumes

> These paths may change if using local development instead of containers.

- `backend/config/config.sample.py` -> `/usr/src/app/config/config.py`
- `backend/config/mysql.conf` -> `/usr/src/app/config/mysql.conf`

## Using Docker for development

### Requirements

- Docker

On Visual Studio Code, open the the command palette and select "Reopen on Container".

Then, from inside of the container you can run the application as usual.

If you need more Docker documentation, check the [DOCKER file](/docs/docker.md)

## Using a virtual env on the host machine

Use a virtual environment:

```
python3 -m venv env
source env/bin/activate
```

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

## Related Links

- https://mariadb.com/resources/blog/installing-mariadb-10-1-16-on-mac-os-x-with-homebrew/
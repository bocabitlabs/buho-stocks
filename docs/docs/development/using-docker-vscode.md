---
sidebar_position: 5
---
# Using Docker and VSCode for development

On Visual Studio Code, open the the command palette and select "Reopen on Container".

Then, from inside of the container you can run the application as usual.

If you need more Docker documentation, check the [DOCKER docs](/development/other-docker-commands.md)


## Configuring the volumes

Before starting, keep in mind that the application uses 2 volumes to persist the config and the uploads. Create a volume for each of these folders and map them to the following locations.

- `/usr/src/app/config`: Folder with the configuration files (application and DB)
- `/usr/src/media`: Folder for the uploads

## Update the config files and put them in the volumes

:::tip Tip

  These paths may change if using local development instead of containers.

:::

- `backend/config/config.sample.py` -> `/usr/src/app/config/config.py`
- `backend/config/mysql.conf` -> `/usr/src/app/config/mysql.conf`

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
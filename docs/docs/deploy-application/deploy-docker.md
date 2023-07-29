---
sidebar_position: 2
---
# Deploy using Docker

You can deploy this application using Docker and the command line. To do so, follow these steps.

## Requirements

- Docker

## Database

Please refer to [Choosing a database docs](/docs/development/database-selection) to select and run a database for the application.

You can choose between `SQLite` and `MySQL`/`MariaDB`.

### Configuring the volumes

Before starting, keep in mind that the application uses 2 volumes to persist the config and the uploads. Create a volume for each of these folders and map them to the following locations.

- `/usr/src/app/config`: Folder with the configuration files (application and DB).
- `/usr/src/media`: Folder for the uploads.

## Rename the sample config files update their values

Rename the following files and update its values accordingly:

- `backend/config/config.sample.py`: Application configuration. ([link to the file](https://github.com/bocabitlabs/buho-stocks/blob/main/backend/config/config.sample.py))
- `backend/config/mysql.conf`: Database configuration. ([link to the file](https://github.com/bocabitlabs/buho-stocks/blob/main/backend/config/mysql.sample.conf))

The final location of these files in the container must be the following:

- `/usr/src/app/config/`:
    - `config.py`
    - `mysql.conf`

## Run the container
:::tip Paths

  These two paths are paths in your host machine:

  - `$HOME/projects/buho-volumes/media/`
  - `$HOME/projects/buho-volumes/data/`

:::

```bash
docker run \
 --publish 34800:34800 \
  -v $HOME/projects/buho-volumes/media/:/usr/src/media:rw \
  -v $HOME/projects/buho-volumes/data/:/usr/src/app/config:rw \
  bocabitlabs/buho-stocks:latest
```

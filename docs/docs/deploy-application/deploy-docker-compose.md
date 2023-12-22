---
sidebar_position: 2
---
# Deploy using Docker Compose

You can deploy this application using Docker Compose. To do so, follow these steps.

## Requirements

- Docker

## Database

Please refer to [Choosing a database docs](/docs/development/database-selection) to select and run a database for the application.

You can choose between `SQLite` and `MySQL`/`MariaDB`.

## Create a .env.prod file

Use the `.env.sample` file and rename it to `.env.prod` (`cp .env.sample .env.prod`) and populate all its values to the desired ones.

### Deploy the application with Docker Compose

```bash
docker-compose up
```

This command will deploy all the containers required by the application (backend, frontend, database, redis and celery).

It will take the values from the `.env.prod` file.

### Configuring the volumes (optional)

By default, the volumes will be handled automatically by Docker itself (check the `docker-compose.yml` file). If you want to point them to your own paths, you can modify this file to specify it.

An example pointing to your own path:

```yaml
volumes:
  - /volume2/buho-stocks/logs:/app/media
```


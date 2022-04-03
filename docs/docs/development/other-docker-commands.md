---
sidebar_position: 6
---
# Other Docker commands

Login in the Docker registry:

```
docker login docker.io --username bocabitlabs
```

Logout from the registry:

```
docker logout
```

Build the Docker image:

```
docker build -t bocabitlabs/buho-stocks:latest -t bocabitlabs/buho-stocks:0.0.1-alpha  .
```

Publish the docker image:

```
docker push bocabitlabs/buho-stocks:0.0.1-alpha
```

Run the Docker container on a selected port:

```
docker run --publish 34800:34800 bocabitlabs/buho-stocks
```

## Docker Problems

### No space left on device

:::danger Take care

This action will delete the data from the containers not in use

:::

```
docker system prune
```
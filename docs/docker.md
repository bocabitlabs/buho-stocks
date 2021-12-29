# Docker commands

```
docker build -t bocabitlabs/buho-stocks:latest -t bocabitlabs/buho-stocks:0.0.1-alpha  .
```

```
docker run --publish 34800:34800 bocabitlabs/buho-stocks
```

```
docker logout

```
docker login docker.io --username bocabitlabs
```

```
docker push bocabitlabs/buho-stocks:0.0.1-alpha
```

## Problems

### No space left on device

```
docker system prune
```
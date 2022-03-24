# Development environment

Either use Docker and Visual Studio Code container development.

Use a virtual environment:

```
python3 -m venv env
source env/bin/activate
```

## Database

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

### Links

- https://mariadb.com/resources/blog/installing-mariadb-10-1-16-on-mac-os-x-with-homebrew/
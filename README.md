# Buho Stocks

<p align="center"><img src="logo.png" alt="Buho-Stocks logo" height="200"></p>

<p align="center">Application to manage and track a stocks portfolio with dividends and return for a <a href="https://en.wikipedia.org/wiki/Buy_and_hold" title="Wikipedia">Buy & Hold investment</a> investment strategy.</p>

<p align="center">
<img src="https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/django.yml/badge.svg" href="https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/django.yml" alt="Django CI"/> <img src="https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/react.yml/badge.svg" href="https://github.com/bocabitlabs/buho-stocks-docker/actions/workflows/react.yml" alt="React CI"/> <a href="https://codecov.io/gh/bocabitlabs/buho-stocks-docker" title="CodeCov"><img src="https://codecov.io/gh/bocabitlabs/buho-stocks-docker/branch/master/graph/badge.svg" alt="codecov"/></a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#install">Install</a> •
  <a href="#development">Development</a> •
  <a href="#links">Links</a> •
  <a href="#attributions">Attributions</a>
</p>

## 🎁 Features

| Feature  | Description  |
|---|---|
| Unlimited portfolios  |   |
| Unlimited companies per portfolio  |   |
| Support for stock transactions, dividends and rights | |
| Unlimited sectors and subsectors | |
| Historical Exchange rates from ECB | |
| Import CSV files from Interactive Brokers and ING (Spain) | |
| ~~Export data to CSV~~ | |
| Fetch stock prices and exchange rates from a external source in real time. |
| Multiple charts: dividends, returns, sectors, currencies... | |
| ~~Database backup~~ | |

- Planned: Support for multiple languages

## 🔧 Install

### 0. Requirements

- Docker

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

## 🧑‍💻 Development

### Technologies used

- React
- Django
- Typescript
- Ant Design (UI)
- Docker

### Dev. Requirements

- Python 3.9
- Node 14
- Yarn 1.22

### How to contribute

If you want to participate on the project, please take a look at
the [CONTRIBUTING file](/docs/CONTRIBUTING.md) as it includes information about the branching and commit guideliness.



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


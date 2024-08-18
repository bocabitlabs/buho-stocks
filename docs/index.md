<p align="center"><img src="https://github.com/user-attachments/assets/07ef9f90-e3b5-4bda-85d8-067369e64b78" alt="Buho-Stocks logo" width="200"/></p>

<p align="center">Application to manage and track a stocks portfolio with dividends and return for a <a href="https://en.wikipedia.org/wiki/Buy_and_hold" title="Wikipedia">Buy & Hold investment</a> investment strategy.</p>

<p align="center">
<img src="https://github.com/bocabitlabs/buho-stocks/actions/workflows/django.yml/badge.svg" href="https://github.com/bocabitlabs/buho-stocks/actions/workflows/django.yml" alt="Django CI"/> <img src="https://github.com/bocabitlabs/buho-stocks/actions/workflows/react.yml/badge.svg" href="https://github.com/bocabitlabs/buho-stocks/actions/workflows/react.yml" alt="React CI"/> <a href="https://codecov.io/github/bocabitlabs/buho-stocks" ><img src="https://codecov.io/github/bocabitlabs/buho-stocks/graph/badge.svg?token=GeXfRGSLzP"/></a>
</p>

## Motivation

Using a spreadsheet to manage a portfolio can become a complicated and tedious task, as well as calculating investment returns. That's why I decided to create this application, to simplify these periodic and monotonous tasks of portfolio management.

## Architecture

<p align="center"><img src="/buho-stocks/img/buho-stocks-architecture.png" alt="Buho-Stocks Architecture" width="600"/></p>

The application is composed of several nodes, each one with function:

- **Nginx**: Is the entrypoint of the user. It servers the static files and acts as a reverse proxy to access the Django application.
- **Django**: The application itself. Manages all the logic.
- **Celery**: Runs several tasks in the background, like updating the company and portfolio stats.
- **Redis**: Key/value db used by the application.
- **Database**: Database to store all the application data.

## Development

If you are a developer and want to contribute, please check the [Contribution guideliness](https://github.com/bocabitlabs/buho-stocks/blob/main/.github/CONTRIBUTING.md) and the [Development guides](./development/index.md)

## Deployment

Do you want to deploy the application in production? The documentation to it is available on [Deploy application](./user-guides/deploy-te-application-docker-compose.md)

## User guides

User guides are available [in its corresponding section](./user-guides/index.md).

# Navigation

1. [User Guides](/user-guides/index.md)
   1. [Deploy the application using Docker Compose](/user-guides/deploy-docker-compose.md)
   2. [Initialize the app data](/user-guides/initialize-app-data.md)
   3. [Create a portfolio](/user-guides/create-portfolio.md)
   4. [Create a company](/user-guides/create-company.md)
   5. Add your first shares and dividends
   6. Import dividends from Interactive Brokers
   7. Analyze your portfolio stats and charts
2. [Development guides](/development/index.md)
   1. [Requirements](/development/requirements.md)
   2. [Select a database](/development/database-select.md)
   3. [Install and run the project locally](/development/run-project-locally.md)
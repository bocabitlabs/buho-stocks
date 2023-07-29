FROM python:3.10-slim

WORKDIR /usr/src/app

ENV PYTHONPATH "${PYTHONPATH}:/usr/src"
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV POETRY_VERSION 1.5.0
ENV POETRY_HOME /opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT true
ENV POETRY_CACHE_DIR ${WORKDIR}/.cache
ENV VIRTUAL_ENVIRONMENT_PATH ${WORKDIR}/.venv

# Required to have netcat-openbsd
RUN apt-get update
RUN apt-get install default-libmysqlclient-dev netcat-openbsd gcc -y

# Install Poetry and dependencies
COPY pyproject.toml ./
COPY poetry.lock ./

# Using Poetry to install dependencies without requiring the project main files to be present
RUN pip install poetry==${POETRY_VERSION} && poetry install --only main --no-root --no-directory

COPY ./backend $WORKDIR
COPY ./etc /usr/src/etc

RUN chmod +x /usr/src/etc/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/usr/src/etc/entrypoint.sh"]

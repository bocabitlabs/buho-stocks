FROM tiangolo/uwsgi-nginx:python3.10

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_16.x  | bash -
RUN apt-get -y install nodejs

VOLUME /usr/src/data
VOLUME /usr/src/media

RUN npm install --global yarn

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH "${PYTHONPATH}:/usr/src"
ENV LISTEN_PORT 34800
ENV UWSGI_INI /usr/src/uwsgi.ini
# The following environment variables are used by Poetry to install dependencies
ENV POETRY_VERSION 1.5.0
ENV POETRY_HOME /opt/poetry
ENV POETRY_VIRTUALENVS_IN_PROJECT true
ENV POETRY_CACHE_DIR ${WORKING_DIR}/.cache
ENV VIRTUAL_ENVIRONMENT_PATH ${WORKING_DIR}/.venv


COPY ./uwsgi.ini /usr/src/uwsgi.ini
COPY ./nginx-app.conf /etc/nginx/conf.d/custom.conf
COPY ./prestart.sh /app/prestart.sh

# Install Poetry and dependencies
COPY pyproject.toml ./
COPY poetry.lock ./

# Using Poetry to install dependencies without requiring the project main files to be present
RUN pip install poetry==${POETRY_VERSION} && poetry install --only main --no-root --no-directory

WORKDIR /usr/src/client
COPY ./client/package.json /usr/src/client/package.json
COPY ./client/yarn.lock /usr/src/client/yarn.lock
COPY ./client/yarn.lock /usr/src/client/vite.config.ts
RUN yarn --production --pure-lockfile
COPY ./client /usr/src/client

RUN yarn build
RUN rm -rf /usr/src/client/node_modules/
RUN mkdir /app/frontend/
RUN mv ./dist/* /app/frontend/

WORKDIR /usr/src/app
COPY ./backend /usr/src/app

RUN mkdir /usr/src/media/
RUN mkdir /usr/src/logs/
# copy project
COPY ./backend/config/config.sample.py /usr/src/app/config/config.py

EXPOSE 34800

RUN poetry run python manage.py collectstatic
RUN sed -i -e "s/REPLACE_SECRET_KEY/$(od -x /dev/urandom | head -1 | awk '{OFS="-"; print $2$3,$4,$5,$6,$7$8$9}')/g" /usr/src/app/config/config.py



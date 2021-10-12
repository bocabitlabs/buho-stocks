# pull the official base image
#FROM python:3.9.7-buster
FROM tiangolo/uwsgi-nginx:python3.9

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs
RUN npm install

RUN npm install --global yarn

# set work directory
WORKDIR /usr/src/backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH "${PYTHONPATH}:/usr/src"
ENV LISTEN_PORT 8000

ENV UWSGI_INI /usr/src/uwsgi.ini
COPY ./uwsgi.ini /usr/src/uwsgi.ini

COPY ./nginx-app.conf /etc/nginx/conf.d/custom.conf

COPY ./prestart.sh /app/prestart.sh

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/backend
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./backend /usr/src/backend

WORKDIR /usr/src/client
COPY ./client /usr/src/client
RUN yarn

RUN yarn build
RUN mkdir /app/frontend/
RUN mv ./build/* /app/frontend/

WORKDIR /usr/src/backend

# copy project
COPY ./config/config.sample.py /usr/src/backend/config/config.py
COPY ./data/db.sqlite3.base /usr/src/data/db.sqlite3

EXPOSE 8000

RUN python manage.py collectstatic

RUN sed -i -e "s/REPLACE_SECRET_KEY/$(od -x /dev/urandom | head -1 | awk '{OFS="-"; print $2$3,$4,$5,$6,$7$8$9}')/g" /usr/src/backend/config/config.py

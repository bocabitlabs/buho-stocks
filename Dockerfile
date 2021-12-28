FROM tiangolo/uwsgi-nginx:python3.9

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs
RUN npm install

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
COPY ./uwsgi.ini /usr/src/uwsgi.ini

COPY ./nginx-app.conf /etc/nginx/conf.d/custom.conf

COPY ./prestart.sh /app/prestart.sh

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src
RUN pip install --no-cache-dir --upgrade -r /usr/src/requirements.txt

WORKDIR /usr/src/client
COPY ./client /usr/src/client

RUN yarn

RUN yarn build
RUN mkdir /app/frontend/
RUN mv ./build/* /app/frontend/

WORKDIR /usr/src/app
COPY ./backend /usr/src/app

RUN mkdir /usr/src/media/
# copy project
#COPY ./config/config.sample.py /usr/src/backend/config/config.py
COPY ./data/db.sqlite3.base /usr/src/data/db.sqlite3

EXPOSE 34800

RUN python manage.py collectstatic

RUN sed -i -e "s/REPLACE_SECRET_KEY/$(od -x /dev/urandom | head -1 | awk '{OFS="-"; print $2$3,$4,$5,$6,$7$8$9}')/g" /usr/src/app/config/config.py

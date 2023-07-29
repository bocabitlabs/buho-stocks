FROM node:16-alpine as builder
WORKDIR /app
COPY ./client/package*.json ./
COPY ./client/yarn.lock ./
RUN yarn install

ENV VITE_ENV=production
ENV VITE_PORT=
ENV VITE_API_URL=

RUN ls -la
COPY ./client ./
RUN yarn build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
FROM node:20-alpine as builder
WORKDIR /app
COPY ./client/package*.json ./
RUN npm ci

ENV VITE_ENV=production
ENV VITE_PORT=
ENV VITE_API_URL=

LABEL org.opencontainers.image.authors='renefernandez@duck.com' \
      org.opencontainers.image.url='https://github.com/bocabitlabs/buho-stocks/pkgs/container/buho-stocks-client' \
      org.opencontainers.image.documentation='https://bocabitlabs.github.io/buho-stocks/' \
      org.opencontainers.image.source="https://github.com/bocabitlabs/buho-stocks" \
      org.opencontainers.image.vendor='Bocabitlabs (Rene Fernandez)' \
      org.opencontainers.image.licenses='GPL-3.0-or-later'

RUN ls -la
COPY ./client ./
RUN npm run build

FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
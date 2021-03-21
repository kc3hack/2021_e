FROM rust:1.50.0-alpine3.12

RUN mkdir app

WORKDIR /app/

COPY . /app/

RUN apk add alpine-sdk

EXPOSE 8080
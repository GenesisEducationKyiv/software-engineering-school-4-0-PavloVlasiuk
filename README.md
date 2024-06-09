## Description

API service that allows you to get current rate USD to UAH. It uses NBU API to get exchange rate.

## Installation

```bash
$ npm install
```

## Applying migrations

```bash
$ npm run migrate
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
There are 9 unit test available

```bash
# unit tests
$ npm run test
```

## Running in Docker

```bash
# build image and up containers in background
$ docker compose up -d --build
```
It should perform auto migration while starting the containers but this part of app was not well tested, so there can be errors here
# Reminder Microservice

## Purpose

NodeJS Typescript REST API providing Reminder-Functionality. This repository is part of [BHT-Bot Infrastructure](https://github.com/beuthbot/beuthbot).

## Structure

- Container definition [Dockerfile](./Dockerfile)
- Container configuration [docker-compose.yml](./docker-compose.yml)

## Cron Jobs

Cronjobs are the heartbeat of the reminder service. there are two jobs running:

 - [ReminderCron.ts](./src/cron/ReminderCron.ts) is sending due reminders to the gateway and reschedules recurring once
 - [CleanupCron.ts](./src/cron/CleanupCron.ts) is cleaning old Reminder data - those are kept for some days for debuggability and then deleted for data protection

## Parsing Rasa Intents

Most of the date parsing work is done by Rasa outside this service, it's passed as intents and entities to the endpoint.

Parsing of those Intent-Data is done within [Parser.ts](./src/intentparser/Parser.ts), entities can be found in [src/intentparser/entities](./src/intentparser/entities)

## Storage

The service utilizes a postgres database for storing the reminder entries. This database is part of [docker-compose.yml](./docker-compose.yml) for development.

ORM [Models](./src/model) are used to store and retrieve data through a central [connection module](./src/repository/connector.ts) which can be [seeded](./src/repository/seeder.ts) for dev puroposes.

## Contribution

Every command used to control this service shall be added to [package.json](./package.json) as a single point of truth and may be documented within this README.

### Watcher

For easy development run `npm run dev` which will start a watcher reloading the service on code changes

### .env

You need to configure your enviornment by copy-pasting [.env.example](./.env.example) `$ cp .env.example .env` and change accourding to your local setup

### Deployment

See general [deployment guidelines](https://github.com/beuthbot/beuthbot) for BHT-Bot Microservices 

### Todo List
- Recurring Reminders are implemented as Cron logic + "interval intents" exist and arrive in the service. Intent parsing does require some mapping and regex-parsing of the intervals supplied by rasa like 'alle 2 Tage'. This part is missing

### Contributors

- Service was initially created by Dennis Walz (2020/21)
- Rasa intents were initially crafted by Robert Halwaß (2020/21)

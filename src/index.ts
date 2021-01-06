/**
 *
 * Reminder Service
 *
 * Contributers
 * - Dennis Walz 2020
 */

/* Init environment from .env for non-docker */
import {config as dotenvConfig} from 'dotenv';
dotenvConfig();

import {Connector} from './repository/connector';
import {registerCronjobs} from "./cron";

/* Init Service */
import {Service, AppConfig} from '@bhtbot/bhtbotservice';

import {seedRandomEntries, seedRecurringEntry} from "./repository/seeder";
import {IntervalTypes} from "./model/Time";


// const database = new Connector().connect(
//     process.env.REMINDER_DATABASE_ADDRESS,
//     5432,
//     process.env.REMINDER_DATABASE_USER,
//     process.env.REMINDER_DATABASE_PASSWORD,
//     'reminder_service'
// );
const database = new Connector().connect(
    'localhost',
    5432,
    process.env.REMINDER_DATABASE_USER,
    process.env.REMINDER_DATABASE_PASSWORD,
    'reminder_service'
).then(async (database)=>{

    //todo remove test
    // await seedRandomEntries(1);
    // await seedRecurringEntry(2, IntervalTypes.minutes);
    // await seedRecurringEntry(5, IntervalTypes.minutes);
    // await seedRecurringEntry(7, IntervalTypes.minutes);
    // await seedRecurringEntry(10, IntervalTypes.minutes);
    // await seedRecurringEntry(1, IntervalTypes.hours);

    registerCronjobs();

    return database;
});



const config = new AppConfig();
config.port = process.env.REMINDER_PORT ? Number(process.env.REMINDER_PORT) : 3000;
const app = new Service('reminderService', config);

app.endpoint('remind', async (req, answ)=>{
    console.log(req, answ)
    return answ;
})

/* Start server */
app.start();
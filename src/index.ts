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
import {Service, AppConfig} from "@bhtbot/bhtbotservice";

import {seedRandomEntries, seedRecurringEntry} from "./repository/seeder";
import {IntervalTypes} from "./model/Time";
import {parseIntent} from "./intentparser/Parser";
import {BotUser} from "@bhtbot/bhtbot";


// const database = new Connector().connect(
//     process.env.REMINDER_DATABASE_ADDRESS,
//     5432,
//     process.env.REMINDER_DATABASE_USER,
//     process.env.REMINDER_DATABASE_PASSWORD,
//     'reminder_service'
// );
const database = new Connector().connect(
    process.env.REMINDER_DATABASE_ADDRESS,
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
    // console.log(req, answ)

    console.log('request user', req)

    const result = parseIntent(req.intent, req.entities, req.user);
    if(!result.success){
        return answ.setError(result.errorMessage).setCacheable(false);
    }

    if(!result.reminder){
        return answ.setError('Could not create reminder for unknown reasons').setCacheable(false);
    }

    await result.reminder.save();
    console.log('saved reminder', result.reminder)

    return answ.setContent(result.reminder.toHumanReadable()).setCacheable(false);
})

/* Start server */
app.start();

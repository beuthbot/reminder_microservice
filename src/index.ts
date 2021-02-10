/**
 *
 * Reminder Service
 *
 * Contributers
 * - Dennis Walz 2020
 */

/* Init environment from .env for non-docker */
import {config as dotenvConfig} from 'dotenv';
import {Connector} from './repository/connector';
import {registerCronjobs} from "./cron";

/* Init Service */
import {AppConfig, Service} from "@bhtbot/bhtbotservice";

import {parseIntent} from "./intentparser/Parser";

dotenvConfig();

const database = new Connector().connect(
    process.env.REMINDER_DATABASE_ADDRESS,
    5432,
    process.env.REMINDER_DATABASE_USER,
    process.env.REMINDER_DATABASE_PASSWORD,
    'reminder_service'
).then(async (database)=>{

    registerCronjobs();

    return database;
});



const config = new AppConfig();
config.port = process.env.REMINDER_PORT ? Number(process.env.REMINDER_PORT) : 3000;
const app = new Service('reminderService', config);

app.endpoint('remind', async (req, answ)=>{

    const result = await parseIntent(req.intent, req.entities, req.user);

    console.log('user request answer', result);

    if(!result.success){
        return answ.setError(result.errorMessage).setCacheable(false);
    }

    return answ.setContent(result.message).setCacheable(false);
})

/* Start server */
app.start();

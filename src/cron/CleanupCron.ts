import * as cron from 'node-cron';
import {ReminderService} from "../service/ReminderService";
import {IntervalTypes} from "../model/Time";
import moment = require("moment");

export default function schedule(){

    cron.schedule('0 */4 * * *', async () => {

        const cleanOlderThanDays: number = process.env.REMINDER_CLEAR_OLDER_THAN_DAYS ? Number(process.env.REMINDER_CLEAR_OLDER_THAN_DAYS) : 7;
        const duration = moment.duration({[IntervalTypes.days]: cleanOlderThanDays})
        const cleanUntil = moment().subtract(duration);
        console.log('Clean reminders older than '+cleanOlderThanDays+'days: ' + cleanUntil.calendar())
        const reminders = await ReminderService.getRemindersRemindAtInDateRange(undefined, cleanUntil.unix());
        reminders.forEach(reminder => {
            console.log('DELETE old reminder ', reminder);
            reminder.remove()
        });
    });
}


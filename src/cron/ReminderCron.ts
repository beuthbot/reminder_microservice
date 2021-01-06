import * as cron from 'node-cron';
import {ReminderService} from "../service/ReminderService";
import {Reminder} from "../model/Reminder";
import {currentTimestamp, stringFormatUnixTimestamp} from "../model/Time";

export default function schedule(){

    cron.schedule('* * * * *', async () => {

        console.log('EVERY MINUTE CRON')

        const entries = await ReminderService.getNonRemindedDue();
        console.log('due', entries.length, entries.map(ent=>ent.id));
        console.log('recurring', entries.filter(ent=>ent.isRecurring).length);

        entries.forEach(reminder => {
            reminder.remindedAtUnix = currentTimestamp();

            if(reminder.isRecurring){
                const nextSchedule = reminder.reschedule();
                nextSchedule.save().then(res=>{
                    console.log(
                        `${reminder.prevRecurringId} -> ${reminder.id} -> ${nextSchedule.id}`,
                        'rescheduled from ', stringFormatUnixTimestamp(reminder.remindAtUnix), 'to', stringFormatUnixTimestamp(nextSchedule.remindAtUnix));

                });
            }

            //todo remind entries

            reminder.save();
        })


    });
}


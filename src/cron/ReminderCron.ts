import * as cron from 'node-cron';
import {ReminderService} from "../service/ReminderService";
import {Reminder} from "../model/Reminder";
import {currentTimestamp, stringFormatUnixTimestamp} from "../model/Time";
import axios from 'axios';

export default function schedule(){

    cron.schedule('* * * * *', async () => {

        console.log('EVERY MINUTE CRON')

        const entries = await ReminderService.getNonRemindedDue();
        console.log('due', entries.length, entries.map(ent=>ent.id));
        console.log('recurring', entries.filter(ent=>ent.isRecurring).length);

        for (const reminder of entries) {
            reminder.remindedAtUnix = currentTimestamp();

            if(reminder.isRecurring){
                const nextSchedule = reminder.reschedule();
                nextSchedule.save().then(res=>{
                    console.log(
                        `${reminder.prevRecurringId} -> ${reminder.id} -> ${nextSchedule.id}`,
                        'rescheduled from ', stringFormatUnixTimestamp(reminder.remindAtUnix), 'to', stringFormatUnixTimestamp(nextSchedule.remindAtUnix));

                });
            }

            //todo get user clients from database service when released
            const userClients = [
                {serviceName: 'discord', clientId: '185540011314249729'}
            ];

            for (const {serviceName, clientId} of userClients) {
                try{
                    const data = {
                        token: process.env.USERMESSENGER_TOKEN,
                        service: serviceName,
                        user: clientId,
                        message: 'Erinnerung: ' + reminder.title
                    };
                    console.log('posting to usermessenger', data)
                    const response = axios.post(process.env.USERMESSENGER_ENDPOINT, data);
                }
                catch (e) {
                    console.log(e);
                }
            }

            reminder.save();
        }


    });
}


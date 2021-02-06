import * as cron from 'node-cron';
import {ReminderService} from "../service/ReminderService";
import {Reminder} from "../model/Reminder";
import {currentTimestamp, stringFormatUnixTimestamp} from "../model/Time";
import axios from 'axios';

export default function schedule(){

    cron.schedule('* * * * *', async () => {

        const entries = await ReminderService.getNonRemindedDue();

        if(entries.length > 0){
            console.log('reminder due', entries.length, entries.map(ent=>ent.id));
            console.log('with recurring', entries.filter(ent=>ent.isRecurring).length);
        }

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

            console.log('query user data for reminder', reminder);
            const userData = await axios.get(process.env.DATABASE_USER_ENDPOINT + reminder.userId);
            const userClients = (userData && userData.data ? userData.data.messengerIDs : []).map(messengerData => ({
                serviceName: messengerData.messenger,
                clientId: messengerData.id
            }))
            console.log('user clients', userClients)

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
                    console.log('could not send to usermessenger', e);
                }
            }

            reminder.save();
        }


    });
}


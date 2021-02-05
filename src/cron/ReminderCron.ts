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

            //{"_id":"601bf844b70b3700180d8eaa","id":13,"nickname":null,"firstName":"sick","lastName":null,"messengerIDs":[{"messenger":"discord","id":"185540011314249729"}],"details":[]}
            const userData = await axios.get(process.env.DATABASE_USER_ENDPOINT + reminder.userId);
            const userClients = (userData && userData.data ? userData.data.messengerIDs : []).map(messengerData => ({
                serviceName: messengerData.messenger,
                clientId: messengerData.id
            }))


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


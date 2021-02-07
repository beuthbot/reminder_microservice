import * as cron from 'node-cron';
import {ReminderService} from "../service/ReminderService";
import {currentTimestamp, stringFormatUnixTimestamp} from "../model/Time";
import axios from 'axios';
import moment = require("moment");

export default function schedule(){

    cron.schedule('* * * * *', async () => {

        const entries = await ReminderService.getNonRemindedDue();
        const nowUnix = moment().unix();

        if(entries.length > 0){
            console.log('reminder due', entries.length, entries.map(ent=>ent.id));
            console.log('with recurring', entries.filter(ent=>ent.isRecurring).length);
        }

        for (const reminder of entries) {
            reminder.remindedAtUnix = currentTimestamp();
            await reminder.save();    //save remindedAt before reminding prevents reminder-loops (potential spam) on failure

            try {
                if (reminder.isRecurring) {
                    let nextSchedule = reminder.reschedule(), securityBreak = 10000;

                    /* heighten nextSchedule until it's a future date prevents (multiple) old entries generated when server is down for some time */
                    while (nextSchedule.remindAtUnix < nowUnix){
                        nextSchedule = nextSchedule.reschedule();
                        if(securityBreak-- < 0){
                            throw Error('Could not reschedule without endless loop');
                        }
                    }

                    /* Save next schedule */
                    nextSchedule.save().then(res => {
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
                    try {
                        const data = {
                            token: process.env.USERMESSENGER_TOKEN,
                            service: serviceName,
                            user: clientId,
                            message: 'Erinnerung: ' + reminder.title
                        };
                        console.log('posting to usermessenger', data)
                        const response = axios.post(process.env.USERMESSENGER_ENDPOINT, data);
                    } catch (e) {
                        console.log('could not send to usermessenger', e);
                    }
                }
            }
            catch (e) {
                console.error('Could not process reminder', e)
            }
        }


    });
}


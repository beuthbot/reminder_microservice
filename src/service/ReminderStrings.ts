import {Reminder} from "../model/Reminder";

export function toIndexedList(reminders: Reminder[]){
    if(reminders.length === 0) return 'No reminders in list';

    let msg = '';
    reminders.forEach((reminder, idx)=>{
        msg += ` [${idx + 1}] ${reminder.toHumanReadable()}\n`
    })
    return msg;
}

export function deletableListMessage(reminders: Reminder[]){
    let msg = "Your reminders (can be deleted by using their temporary ids)\n";
    return msg + toIndexedList(reminders)
}

import {currentTimestamp} from "../model/Time";
import {Reminder} from "../model/Reminder";

export async function seedRandomEntries(amount: number) {
    for(let i = 0; i < amount; i++){
        const maxRandomMillis = 60 * 10 * 1000;
        const testEntry = Reminder.builder('testUser', 'Random Scheduled Test Entry',
            currentTimestamp() + Math.floor(Math.random() * maxRandomMillis)).build();
        await testEntry.save();
    }
}

export async function seedRecurringEntry(recurStep: number, recurType: string){
    const testRecurEntry = Reminder.builder('recurUser', 'Recurring Test Entry ' + recurStep + ' ' + recurType, currentTimestamp())
        .setRecurring(recurStep, recurType).build();
    await testRecurEntry.save();
}
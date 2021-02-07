import {getCurrentConnection} from "../repository/connector";
import {Reminder} from "../model/Reminder";
import {currentTimestamp} from "../model/Time";

class ReminderServiceClass {

    async schedule(reminder: Reminder){
        await reminder.save();
    }

    async getNonRemindedDue(){
        return await getCurrentConnection()
            .getRepository(Reminder).createQueryBuilder('reminder')
            .where("reminder.remindedAtUnix = :remindedAtUnix", { remindedAtUnix: 0 })
            .andWhere("reminder.remindAtUnix <= :remindAtUnix", { remindAtUnix: currentTimestamp() })
            .getMany();
    }

    async getAllByUser(userId: string, includeOld: boolean = false){
        const builder = getCurrentConnection()
            .getRepository(Reminder).createQueryBuilder('reminder')
            .where("reminder.userId = :userId", { userId })

        if(!includeOld){
            builder.andWhere("reminder.remindAtUnix >= :remindAtUnix", { remindAtUnix: currentTimestamp() })
        }

        return builder.getMany();
    }

}

export const ReminderService = new ReminderServiceClass();

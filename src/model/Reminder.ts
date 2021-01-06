import {BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {applyInterval} from "./Time";

@Entity()
export class Reminder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isRecurring: boolean = false;

    @Column()
    recurIntervalStep: number = 0;

    @Column({length: 16})
    recurIntervalType: string = 'month';

    @Column("bigint")
    remindAtUnix: number;

    @Column({length: 1024})
    title: string;

    @Column({length: 64})
    userId: string;

    @Column({type:"text", nullable:true})
    description: string;

    @Column("bigint")
    remindedAtUnix: number = 0;

    @Column("bigint")
    prevRecurringId: number = 0;

    calculateNextRecurringTimestamp() {

    }
    reschedule() {

        const builder = Reminder.builder(this.userId, this.title, applyInterval(this.remindAtUnix, this.recurIntervalType, this.recurIntervalStep));

        if(this.isRecurring){
            builder.setRecurring(this.recurIntervalStep, this.recurIntervalType, this.id);
        }

        return builder.build();
    }

    static builder(user: string, title: string, remindAtUnix: number){
        const item = new Reminder();
        item.userId = user;
        item.title = title;
        item.remindAtUnix = remindAtUnix;

        const builder = {
            build(){ return item; }
        }

        return Object.assign(builder, {

            setRecurring(intervalStep: number, intervalType: string, previousId?: number){
                item.recurIntervalStep = intervalStep;
                item.recurIntervalType = intervalType;
                item.isRecurring = true;
                if(previousId){
                    item.prevRecurringId = previousId
                }
                return builder;
            },

            build(){
                return item;
            }
        });
    }
}
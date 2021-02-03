import {ParsedEntities, entityTypes, parseEntities, validateEntities} from "./ParsedEntities";
import {ParseResponse} from "./ParseResponse";
import * as moment from 'moment';
import {Reminder} from "../model/Reminder";
import {currentTimestamp} from "../model/Time";
import {BotUser} from '@bhtbot/bhtbot';


function handleSetOnce(user: BotUser, entities: ParsedEntities) : ParseResponse {

    const response = validateEntities(entities, ['topic', 'time', 'date'])
    if(!response.success) return response;

    const targetDate = moment(entities.time.value);
    if(!targetDate) return response.setError("Cant parse date");

    const targetTopic = entities.topic.value;
    if(!targetDate) return response.setError("Cant parse topic");

    const reminder = Reminder.builder(user.id, targetTopic, targetDate.unix()).build();
    response.reminder = reminder;

    // console.log('entities', entities)
    // console.log('additional', entities.time.additional_info)
    // console.log('target date', targetDate, targetTopic)

    return response;
}

export function parseIntent(intent, entities, user){
    console.log('handle intent', intent.name)
    entities = parseEntities(entities);
    console.log('handle entities', entities)
    switch (intent.name){
        case 'reminder-set-once':
            return handleSetOnce(user, entities);
        default: throw new Error('Unknown intent ' + intent.name);
    }
}

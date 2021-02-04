import {ParsedEntities, entityTypes, parseEntities, validateEntities} from "./ParsedEntities";
import {ParseResponse} from "./ParseResponse";
import * as moment from 'moment';
import {Reminder} from "../model/Reminder";
import {currentTimestamp, IntervalTypes} from "../model/Time";
import {BotUser} from '@bhtbot/bhtbot';

const rasaToMomentMapping = {
    'jede Minute': IntervalTypes.minutes,
    'jede Stunde': IntervalTypes.hours,
    'jeden Tag': IntervalTypes.hours,
    'jede Woche': IntervalTypes.weeks,
    'jeden Monat': IntervalTypes.months,
    'jedes Jahr': IntervalTypes.years
//     alle 2 Sekunden
//     alle 3 Minuten
//     alle 4 Stunden
//     alle 5 Wochen
//     alle 6 Monate
//     alle 7 Jahre
//     jeden Montag
//     jeden Dienstag
//     jeden Mittwoch
//     jeden Donnerstag
//     jeden Freitag
//     jeden Samstag
//     jeden Sonntag
}

function handleSetInterval(user: BotUser, entities: ParsedEntities) : ParseResponse {

    const response = validateEntities(entities, ['topic', 'interval'])
    if(!response.success) return response;

    const targetDate = entities.time ? moment(entities.time.value) : moment();
    if(!targetDate) return response.setError("Cant parse date");

    const targetTopic = entities.topic.value;
    if(!targetDate) return response.setError("Cant parse topic");

    const intervalRasa = entities.interval.value.toLowerCase();
    const matchedIntervals = Object.keys(rasaToMomentMapping)
        .map(key=>key.toLowerCase() === intervalRasa ? rasaToMomentMapping[key] : null)
        .filter(el => el !== null);
    if(matchedIntervals.length === 0) return response.setError("Can't parse interval")

    // const reminder = Reminder.builder(user.id, targetTopic, targetDate.unix()).setRecurring().build();
    // response.reminder = reminder;


    console.log('matched intervals', matchedIntervals)
    //todo...

    return response;
}

function handleSetOnce(user: BotUser, entities: ParsedEntities) : ParseResponse {

    const response = validateEntities(entities, ['topic', 'time'])
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
    entities = parseEntities(entities);
    switch (intent.name){
        case 'reminder-set-once':
            return handleSetOnce(user, entities);
        case 'reminder-set-interval':
            return handleSetInterval(user, entities);
        default: throw new Error('Unknown intent ' + intent.name);
    }
}

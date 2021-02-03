import {DateEntity} from './entities/Date';
import {IntervalEntity} from './entities/Interval';
import {TimeEntity} from './entities/TimeEntity';
import {TopicEntity} from './entities/Topic';
import {ParseResponse} from "./ParseResponse";

export {DateEntity, IntervalEntity, TimeEntity, TopicEntity}

export const entityTypes = {
    date: DateEntity,
    time: TimeEntity,
    interval: IntervalEntity,
    topic: TopicEntity,
};

export class ParsedEntities {
    date: DateEntity = null;
    interval: IntervalEntity = null;
    time: TimeEntity = null;
    topic: TopicEntity = null;
}

export function parseEntities(entities){
    const result = new ParsedEntities();
    if(entities){
        entities.forEach(ent=>{
            if(entityTypes[ent.entity] !== undefined){
                if(result[ent.entity] !== null){
                    throw new Error('unexpected state: multiple entities of same type')
                }
                result[ent.entity] = ent;
            }
        })
    }
    return result;
}


export function validateEntities(entities: ParsedEntities, expectedEntities: string[]) : ParseResponse {

    for(let i = 0; i < expectedEntities.length; i++){
        if(!entities[expectedEntities[i]]){
            return new ParseResponse(false, "Entity missing in Intent: " + expectedEntities[i])
        }
    }
    return new ParseResponse(true);
}


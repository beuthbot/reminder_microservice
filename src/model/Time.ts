import * as moment from 'moment';

export const IntervalTypes = {
    years: 'years',
    months: 'months',
    weeks: 'weeks',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds'
}

export function applyInterval(unixTimestamp: number, intervalType:string, step: number){

    let units: moment.unitOfTime.DurationConstructor = <"year" | "years" | "y" | "month" | "months" | "M" | "week" | "weeks" | "w" | "day" | "days" | "d" | "hour" | "hours" | "h" | "minute" | "minutes" | "m" | "second" | "seconds" | "s" | "millisecond" | "milliseconds" | "ms" | "quarter" | "quarters" | "Q">intervalType;
    const time = moment.unix(unixTimestamp).add(step, units);

    return time.unix();
}

export function stringFormatUnixTimestamp(unixTimestamp: number){
    return moment.unix(unixTimestamp)
        .format('MMMM Do YYYY, h:mm:ss a');
}

export function currentTimestamp(){
    return moment().unix();
}
export class TimeEntity{
    static entityName: 'time';
    entity: 'time';
    start: 14;
    end: 29;
    text: 'in einer Minute';
    value: '2021-02-03T16:20:46.000+01:00';
    confidence: 1;
    additional_info: {
        values: [
            {
                value: '2021-02-03T17:20:59.000+01:00',
                grain: 'second',
                type: 'value'
            }
        ],
        value: '2021-02-03T16:55:02.000+01:00',
        grain: 'second',
        type: 'value'
    };
    // extractor: 'DucklingEntityExtractor'
}

describe('config/validateConfig', () => {

    it('Catches non-object input');

    ['monitors', 'notify', 'email_notifier'].forEach(field => 
        it(`Rejects missing field: ${field}`)
    );

    it('Catches invalid monitor item')

    it('Catches invalid notify item')

    it('Catches invalid email_notifier')

    // ['label', 'type', 'interval', 'request'].forEach(field => 
    //     it(`Rejects missing field from monitors.*: ${field}`)
    // );

    // it('Rejects uknown monitors.*.type')


})
import check from '../../../../src/monitors/checkers/response_code'
import { MonitorType } from '../../../../src/config/Config'
import sinon from 'sinon'
import { assert } from 'chai'

describe('monitors/handlers/response_code', function() {

    this.timeout(10_000);

    const baseConfig = {
        label: 'Page opens fine',
        type: MonitorType.response_code,
        interval: '30 minutes',
    } as const;

    it('Reports an error-throwing code (404 instead of 200)', done => {
        check({ ...baseConfig, expected_code: 200, request: 'http://target/foo' })
            .then(result => {
                assert.isNotNull(result);
                assert.equal(result.message, 'Received an unexpected response code: 404')

                done();
            })
            .catch(done);
    })

    it('Reports a successful code (204 instead of 200)', done => {
        check({ ...baseConfig, expected_code: 200, request: 'http://target/give-me-204' })
            .then(result => {
                assert.isNotNull(result);
                assert.equal(result.message, 'Received an unexpected response code: 204')

                done();
            })
            .catch(done);
    })

    it('Reports a successful code (200 instead of 204)', done => {
        check({ ...baseConfig, expected_code: 204, request: 'http://target/index.txt' })
            .then(result => {
                assert.isNotNull(result);
                assert.equal(result.message, 'Received an unexpected response code: 200')

                done();
            })
            .catch(done);
    })

    it('Reports connection failure (host uknown)', done => {
        check({ ...baseConfig, expected_code: 200, request: 'http://target3' })
            .then(result => {
                assert.isNotNull(result);
                assert.equal(result.message, 'getaddrinfo ENOTFOUND target3')

                done();
            })
            .catch(done);
    })

    it('Reports connection failure (port closed)', done => {
        check({ ...baseConfig, expected_code: 200, request: 'http://target:8081' })
            .then(result => {
                assert.isNotNull(result);
                assert.match(result.message, /connect ECONNREFUSED (\d+\.\d+\.\d+\.\d+):8081/)

                done();
            })
            .catch(done);
    })

    it('Passes an expected code (200)', done => {
        check({ ...baseConfig, expected_code: 200, request: 'http://target/index.txt' })
            .then(result => {
                assert.isNull(result);

                done();
            })
            .catch(done);
    })

})

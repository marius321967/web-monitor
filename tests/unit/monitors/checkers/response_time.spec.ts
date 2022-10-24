import { MonitorType, ResponseTimeMonitor } from '@/config/Config'
import { base } from '@/monitors/checkers/response_time'
import { IntervalToMsConverter } from '@/monitors/IntervalToMs'
import { AxiosSender } from '@/monitors/requests/sendAxiosRequest'
import { AxiosResponse } from 'axios'
import { assert } from 'chai'
import sinon, { SinonSpy } from 'sinon'
import { response } from './sampleResponse'

describe('monitors/checkers/response_time', function() {

  this.timeout(5_000);

  const genericError = new Error('FOO_ERR');

  const monitor: ResponseTimeMonitor = {
    label: 'Foo',
    type: MonitorType.response_time,
    interval: '1 day',
    request: 'http://foo.com',
    threshold: `30 seconds`
  };

  const intervalConverter = (result: number): IntervalToMsConverter => sinon.fake.returns(result);

  const delayedSender = 
    (delayMs: number): AxiosSender => 
      sinon.spy(
        () => new Promise<AxiosResponse>(resolve => {
          setTimeout(() => resolve(response()), delayMs);
        })
      )

  const erroneousSender = (err: Error): AxiosSender => sinon.fake.rejects(err);


  it('Sends request', () => {
    const send = delayedSender(0);

    return base(send, intervalConverter(2000))(monitor)
      .then(() => {
        sinon.assert.calledOnceWithExactly(send as SinonSpy, 'http://foo.com');
      })
  })

  it('Converts interval to ms', () => {
    const intervalToMs = intervalConverter(2000);

    return base(delayedSender(0), intervalToMs)(monitor)
      .then(() => {
        sinon.assert.calledOnceWithExactly(intervalToMs as SinonSpy, '30 seconds');
      })
  })

  it('Fails if request takes too long', () => 
    base(delayedSender(2000), intervalConverter(1000))(monitor)
      .then(result => {
        assert.isNotNull(result);
        assert.equal((result as Error).message, 'Request took too long');
      })
  )

  it('Fails after threshold and not after response', () => {
    const startTime = performance.now();

    return base(delayedSender(2000), intervalConverter(1000))(monitor)
      .then(() => {
        const endTime = performance.now();
        const duration = Math.ceil(endTime - startTime);

        assert.isBelow(duration, 2000);
        assert.isAtLeast(duration, 1000);
      })
  })

  it('Succeeds if request finishes in time', () => 
    base(delayedSender(1000), intervalConverter(2000))(monitor)
      .then(result => {
        assert.isNull(result);
      })
  )

  it('Resolves (success) before threshold - does not wait until timeout', () => {
    const startTime = performance.now();

    return base(delayedSender(0), intervalConverter(1000))(monitor)
      .then(() => {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        assert.isBelow(duration, 1000);
      })
  })

  it('Reports axios errors', () => 
    base(erroneousSender(genericError), intervalConverter(1000))(monitor)
      .then(result => {
        assert.equal(result, genericError);
      })
  )
  
})
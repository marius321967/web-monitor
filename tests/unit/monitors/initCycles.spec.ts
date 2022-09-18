import { IntervalClearer, IntervalSetter } from '@/monitors/initCycles'
import { IntervalToMsConverter } from '@/monitors/IntervalToMs'
import sinon, { SinonSpy } from 'sinon'
import { base } from '@/monitors/initCycles'
import { CycleCallback } from '@/monitors/buildCycleCallback'
import { TimeAmount } from '@/config/Config'

describe('monitors/initCycles', () => {

  let intervalBearer: NodeJS.Timer,
    setInterval: IntervalSetter, 
    clearInterval: IntervalClearer,
    intervalToMs: IntervalToMsConverter;

  let callback: CycleCallback, interval: TimeAmount = '2 days';

  beforeEach(() => {
    intervalBearer = Symbol() as unknown as NodeJS.Timer;
    setInterval = sinon.fake.returns(intervalBearer);
    clearInterval = sinon.fake();
    intervalToMs = sinon.fake.returns(123456);

    callback = () => Promise.resolve();
  })

  it(
    'Converts interval string to milliseconds', 
    () => {
      base(setInterval, clearInterval, intervalToMs)(callback, interval);

      sinon.assert.calledOnceWithExactly(intervalToMs as SinonSpy, '2 days');
    }
  )

  it(
    'Initiates interval', 
    () => {
      base(setInterval, clearInterval, intervalToMs)(callback, interval);

      sinon.assert.calledOnceWithExactly(setInterval as SinonSpy, callback, 123456);
    }
  )

  it(
    'Returns stopper that clears the interval',
    () => {
      const stop = base(setInterval, clearInterval, intervalToMs)(callback, interval);

      sinon.assert.notCalled(clearInterval as SinonSpy);
      stop();
      sinon.assert.calledOnce(clearInterval as SinonSpy);
    }
  )

})

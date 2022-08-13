import { IntervalClearer, IntervalSetter } from '@/monitors/initCycles'
import { IntervalToMsConverter } from '@/monitors/IntervalToMs'
import sinon, { SinonSpy } from 'sinon'
import { base } from '@/monitors/initCycles'
import { CycleCallback } from '@/monitors/buildCycleCallback'

describe('monitors/initCycles', () => {

  let intervalBearer: NodeJS.Timer,
    setInterval: IntervalSetter, 
    clearInterval: IntervalClearer,
    intervalToMs: IntervalToMsConverter;

  let callback: CycleCallback, interval = 'foo days';

  beforeEach(() => {
    intervalBearer = Symbol() as unknown as NodeJS.Timer;
    setInterval = sinon.fake.returns(intervalBearer);
    clearInterval = sinon.fake();
    intervalToMs = sinon.fake.returns(123456);

    callback = () => {};
  })

  it(
    'Converts interval string to milliseconds', 
    () => {
      base(setInterval, clearInterval, intervalToMs)(callback, interval);

      sinon.assert.calledOnceWithExactly(intervalToMs as SinonSpy, 'foo days');
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

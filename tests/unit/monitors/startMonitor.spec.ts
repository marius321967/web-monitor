import { base } from '@/monitors/startMonitor'
import { CycleCallback, CycleCallbackBuilder } from '@/monitors/buildCycleCallback'
import { CyclesInitiator } from '@/monitors/initCycles'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../sampleConfig'
import { assert } from 'chai'
import { UniqueMonitorConfig } from '@/config/Config'

describe('monitors/startMonitor', () => {

  let cycleCallback: CycleCallback,
    buildCycleCallback: CycleCallbackBuilder, 
    initCycles: CyclesInitiator;

  const stopper: MonitorStopper = () => {};
  const uniqueConfig: UniqueMonitorConfig = {
    id: 'foo',
    payload: sampleConfig.monitors.ssl
  };

  beforeEach(() => {
    cycleCallback = sinon.fake();
    buildCycleCallback = sinon.fake.returns(cycleCallback);
    initCycles = sinon.fake.returns(stopper);
  })

  it(
    'Uses buildCycleCallback()', 
    () => base(buildCycleCallback, initCycles)(uniqueConfig)
      .then(() => sinon.assert.calledOnceWithExactly(buildCycleCallback as SinonSpy, uniqueConfig))
  )

  it(
    'Uses initCycles()',
    () => base(buildCycleCallback, initCycles)(uniqueConfig)
      .then(() => sinon.assert.calledOnceWithExactly(initCycles as SinonSpy, cycleCallback, '3 days'))
  )

  it(
    'Returns monitor stopper callback', 
    () => base(buildCycleCallback, initCycles)(uniqueConfig)
      .then(result => assert.equal(result, stopper))
  )

  it(
    'Immediately calls first cycle',
    () => base(buildCycleCallback, initCycles)(uniqueConfig)
      .then(() => sinon.assert.calledOnce(cycleCallback as SinonSpy))
  )

})

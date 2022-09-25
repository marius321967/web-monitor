import { base } from '@/app/handleValidConfig'
import { Config } from '@/config/Config'
import { ConfigSetter } from '@/config/container'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import { MonitorsStarter } from '@/startMonitors'
import { assert } from 'chai'
import sinon, { SinonSpy } from 'sinon'

describe('app/handleValidConfig', () => {

  let setConfig: ConfigSetter, startMonitors: MonitorsStarter;

  const monitorStopperToken = Symbol() as unknown as MonitorStopper;
  const configToken = Symbol() as unknown as Config;

  beforeEach(() => {
    setConfig = sinon.fake();
    startMonitors = sinon.fake.resolves([ monitorStopperToken ]);
  })

  it(
    'Sets config gobal', 
    () => base(setConfig, startMonitors)(configToken)
      .then(() => {
        sinon.assert.calledOnceWithExactly(setConfig as SinonSpy, configToken);
      })
  )

  it(
    'Starts monitoring', 
    () => base(setConfig, startMonitors)(configToken)
      .then(() => {
        sinon.assert.calledOnceWithExactly(startMonitors as SinonSpy, configToken);
      })
  )

  it(
    'Returns monitor stopper callbacks', 
    () => base(setConfig, startMonitors)(configToken)
      .then(monitorStoppers => {
        assert.deepEqual(monitorStoppers, [ monitorStopperToken ]);
      })
  )

})
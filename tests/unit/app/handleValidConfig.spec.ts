import { base } from '@/app/handleValidConfig'
import { TerminationHandlerSetup } from '@/app/exit/setupTerminationHandler'
import { Config } from '@/config/Config'
import { ConfigSetter } from '@/config/container'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import { MonitorsStarter } from '@/startMonitors'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../sampleConfig'

describe('app/handleValidConfig', () => {

  let setConfig: ConfigSetter, startMonitors: MonitorsStarter, setupTerminationHandler: TerminationHandlerSetup;

  const monitorStopperToken = Symbol() as unknown as MonitorStopper;
  const config = sampleConfig;
  const configWithoutMonitors = { ...config, monitors: {} };

  beforeEach(() => {
    setConfig = sinon.fake();
    startMonitors = sinon.fake.resolves([ monitorStopperToken ]);
    setupTerminationHandler = sinon.fake();
  })

  it(
    'Sets config gobal', 
    () => base(setConfig, startMonitors, setupTerminationHandler)(config)
      .then(() => {
        sinon.assert.calledOnceWithExactly(setConfig as SinonSpy, config);
      })
  )

  it(
    'Starts monitoring', 
    () => base(setConfig, startMonitors, setupTerminationHandler)(config)
      .then(() => {
        sinon.assert.calledOnceWithExactly(startMonitors as SinonSpy, config);
      })
  )

  it(
    'Uses setupTerminationHandler()', 
    () => base(setConfig, startMonitors, setupTerminationHandler)(config)
      .then(() => {
        sinon.assert.calledOnceWithExactly(setupTerminationHandler as SinonSpy, [ monitorStopperToken ]);
      })
  )

  it(
    'Does nothing when config.monitors is empty', 
    () => base(setConfig, startMonitors, setupTerminationHandler)(configWithoutMonitors)
      .then(() => {
        sinon.assert.notCalled(setConfig as SinonSpy);
        sinon.assert.notCalled(startMonitors as SinonSpy);
        sinon.assert.notCalled(setupTerminationHandler as SinonSpy);
      })
  )

})

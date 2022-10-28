import { base } from '@/app/handleValidConfig'
import { TerminationHandlerSetup } from '@/app/exit/setupTerminationHandler'
import { Config } from '@/config/Config'
import { ConfigSetter } from '@/config/container'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import { MonitorsStarter } from '@/startMonitors'
import sinon, { SinonSpy } from 'sinon'

describe('app/handleValidConfig', () => {

  let setConfig: ConfigSetter, startMonitors: MonitorsStarter, setupTerminationHandler: TerminationHandlerSetup;

  const monitorStopperToken = Symbol() as unknown as MonitorStopper;
  const configToken = Symbol() as unknown as Config;

  beforeEach(() => {
    setConfig = sinon.fake();
    startMonitors = sinon.fake.resolves([ monitorStopperToken ]);
    setupTerminationHandler = sinon.fake();
  })

  it(
    'Sets config gobal', 
    () => base(setConfig, startMonitors, setupTerminationHandler)(configToken)
      .then(() => {
        sinon.assert.calledOnceWithExactly(setConfig as SinonSpy, configToken);
      })
  )

  it(
    'Starts monitoring', 
    () => base(setConfig, startMonitors, setupTerminationHandler)(configToken)
      .then(() => {
        sinon.assert.calledOnceWithExactly(startMonitors as SinonSpy, configToken);
      })
  )

  it(
    'Uses setupTerminationHandler()', 
    () => base(setConfig, startMonitors, setupTerminationHandler)(configToken)
      .then(() => {
        sinon.assert.calledOnceWithExactly(setupTerminationHandler as SinonSpy, [ monitorStopperToken ]);
    })
  )

})

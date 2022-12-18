import { base } from '@/app/handleValidConfig'
import { TerminationHandler, TerminationHandlerSetup } from '@/app/exit/setupTerminationHandler'
import { ConfigSetter } from '@/config/container'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import { MonitorsStarter } from '@/startMonitors'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../sampleConfig'
import { assert } from 'chai'
import { isLeft, isRight, Left } from 'fp-ts/lib/Either'

describe('app/handleValidConfig', () => {

  const terminationHandler: TerminationHandler = Symbol() as unknown as TerminationHandler;

  let setConfig: ConfigSetter, startMonitors: MonitorsStarter, setupTerminationHandler: TerminationHandlerSetup;

  const monitorStopperToken = Symbol() as unknown as MonitorStopper;
  const config = sampleConfig;
  const configWithoutMonitors = { ...config, monitors: {} };

  beforeEach(() => {
    setConfig = sinon.fake();
    startMonitors = sinon.fake.resolves([ monitorStopperToken ]);
    setupTerminationHandler = sinon.fake.returns(terminationHandler);
  })

  describe('When config.monitors is empty', () => {

    let result;

    beforeEach(async () => result = await base(setConfig, startMonitors, setupTerminationHandler)(configWithoutMonitors));

    it(
      'Does nothing', 
      () => {
        sinon.assert.notCalled(setConfig as SinonSpy);
        sinon.assert.notCalled(startMonitors as SinonSpy);
        sinon.assert.notCalled(setupTerminationHandler as SinonSpy);
      }
    )

    it(
      'Returns null', 
      () => assert.isTrue(isRight(result))
    )
  })

  describe('When config.monitors is not empty', () => {

    let result;

    beforeEach(async () => result = await base(setConfig, startMonitors, setupTerminationHandler)(config));

    it(
      'Sets config gobal', 
      () => sinon.assert.calledOnceWithExactly(setConfig as SinonSpy, config)
    )
  
    it(
      'Starts monitoring', 
      () => sinon.assert.calledOnceWithExactly(startMonitors as SinonSpy, config)
    )
  
    it(
      'Uses setupTerminationHandler()', 
      () => sinon.assert.calledOnceWithExactly(setupTerminationHandler as SinonSpy, [ monitorStopperToken ])
    )

    it(
      'Returns result from setupTerminationHandler()', 
      () => (isLeft(result))
        ? assert.equal(result.left, terminationHandler)
        : assert.fail('Expected to return termination handler')
    )
  })

})

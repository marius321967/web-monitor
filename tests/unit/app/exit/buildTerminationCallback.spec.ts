import { MonitorStopper } from '@/monitors/MonitorStopper'
import sinon, { SinonSpy } from 'sinon'
import buildTerminationCallback from '@/app/exit/buildTerminationCallback'
import { assert } from 'chai';

describe('app/exit/buildTerminationCallback', () => {

  let stoppers: MonitorStopper[];

  beforeEach(() => {
    stoppers = [ sinon.fake(), sinon.fake() ];
  })

  it(
    'Returns function', 
    () => assert.isFunction(buildTerminationCallback(stoppers))
  )

  it(
    'Callback stops all monitors', 
    () => {
      const callback = buildTerminationCallback(stoppers);

      sinon.assert.notCalled(stoppers[0] as SinonSpy);
      sinon.assert.notCalled(stoppers[1] as SinonSpy);
      
      callback();
      
      sinon.assert.calledOnce(stoppers[0] as SinonSpy);
      sinon.assert.calledOnce(stoppers[1] as SinonSpy);
    }
  )

})

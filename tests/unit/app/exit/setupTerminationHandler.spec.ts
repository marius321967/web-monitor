import { TerminationCallback, TerminationCallbackBuilder } from '@/app/exit/buildTerminationCallback'
import sinon, { SinonSpy } from 'sinon'
import { base } from '@/app/exit/setupTerminationHandler'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import { assert } from 'chai'
import { SignalListenerRegistrator } from '../../../../src/app/exit/registerSignalListeners'

describe('app/exit/setupTerminationHandler', () => {

  const terminationCallback = Symbol() as unknown as TerminationCallback;
  const stopper = Symbol() as unknown as MonitorStopper;
  const stoppers = [ stopper ];
  let buildTerminationCallback: TerminationCallbackBuilder;
  let registerSignalListeners: SignalListenerRegistrator;

  beforeEach(() => {
    buildTerminationCallback = sinon.fake.returns(terminationCallback);
    registerSignalListeners = sinon.fake();
  })

  it(
    'Builds termination callback', 
    () => {
      base(buildTerminationCallback, registerSignalListeners)(stoppers);

      sinon.assert.calledOnceWithExactly(buildTerminationCallback as SinonSpy, stoppers);
    }
  )

  it('Registers signal listeners', () => {
    base(buildTerminationCallback, registerSignalListeners)(stoppers);

    sinon.assert.calledOnceWithExactly(registerSignalListeners as SinonSpy, terminationCallback);
  })

  it(
    'Returns termination callback', 
    () => {
      const result = base(buildTerminationCallback, registerSignalListeners)(stoppers);

      assert.equal(result, terminationCallback);
    }
  )

})

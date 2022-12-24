import { TerminationCallback, TerminationCallbackBuilder } from '@/app/exit/buildTerminationCallback'
import sinon, { SinonSpy } from 'sinon'
import { base } from '@/app/exit/setupTerminationHandler'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import { assert } from 'chai'

describe('app/exit/setupTerminationHandler', () => {

  const terminationCallback = Symbol() as unknown as TerminationCallback;
  const stopper = Symbol() as unknown as MonitorStopper;
  const stoppers = [ stopper ];
  let nodeProcess: NodeJS.Process, buildTerminationCallback: TerminationCallbackBuilder;

  beforeEach(() => {
    nodeProcess = { on: sinon.fake.returns(nodeProcess) } as unknown as NodeJS.Process;
    buildTerminationCallback = sinon.fake.returns(terminationCallback);
  })

  it(
    'Builds termination callback', 
    () => {
      base(nodeProcess, buildTerminationCallback)(stoppers);

      sinon.assert.calledOnceWithExactly(buildTerminationCallback as SinonSpy, stoppers);
    }
  )

  it(
    'Uses nodeProcess.on("SIGINT")',
    () => {
      base(nodeProcess, buildTerminationCallback)(stoppers);

      sinon.assert.calledOnceWithExactly(nodeProcess.on as SinonSpy, 'SIGINT', terminationCallback);
    }
  )

  it(
    'Returns termination callback', 
    () => {
      const result = base(nodeProcess, buildTerminationCallback)(stoppers);

      assert.equal(result, terminationCallback);
    }
  )

})

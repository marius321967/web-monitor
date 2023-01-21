import sinon, { SinonSpy } from 'sinon'
import { TerminationCallback } from '../../../../src/app/exit/buildTerminationCallback'
import { base } from '../../../../src/app/exit/registerSignalListeners'

describe('app/exit/registerSignalListeners', () => {

  const terminationCallback = Symbol() as unknown as TerminationCallback;
  let nodeProcess: NodeJS.Process;

  beforeEach(() => {
    nodeProcess = { on: sinon.fake.returns(nodeProcess) } as unknown as NodeJS.Process;
  })
  
  beforeEach(() => base(nodeProcess)(terminationCallback))

  it('Registers callback for SIGINT', () => {
    sinon.assert.calledWithExactly(nodeProcess.on as SinonSpy, 'SIGINT', terminationCallback);
  })

  it('Registers callback for SIGTERM', () => {
    sinon.assert.calledWithExactly(nodeProcess.on as SinonSpy, 'SIGTERM', terminationCallback);
  })

})

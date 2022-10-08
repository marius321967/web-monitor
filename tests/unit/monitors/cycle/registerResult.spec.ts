import { UniqueMonitorConfig } from '@/config/Config'
import { CycleFailureRegistrator } from '@/monitors/cycle/registerFailure'
import { CycleSuccessRegistrator } from '@/monitors/cycle/registerSuccess'
import sinon, { SinonSpy } from 'sinon'
import { base } from '@/monitors/cycle/registerResult'

describe('monitors/cycle/registerResult', () => {

  let registerSuccess: CycleSuccessRegistrator, registerFailure: CycleFailureRegistrator;

  beforeEach(() => {
    registerSuccess = sinon.fake.resolves(undefined);
    registerFailure = sinon.fake.resolves(undefined);
  })

  const uniqueConfig = Symbol() as unknown as UniqueMonitorConfig;

  const successfulResult = null;
  const failingResult = new Error('FOO_ERR');

  it('Registers failure', () => 
    base(registerSuccess, registerFailure)(uniqueConfig, failingResult)
      .then(() => {
        sinon.assert.calledOnceWithExactly(registerFailure as SinonSpy, uniqueConfig, failingResult);
        sinon.assert.notCalled(registerSuccess as SinonSpy);
      })

  )

  it('Registers success', () => 
    base(registerSuccess, registerFailure)(uniqueConfig, successfulResult)
      .then(() => {
        sinon.assert.notCalled(registerFailure as SinonSpy);
        sinon.assert.calledOnceWithExactly(registerSuccess as SinonSpy, uniqueConfig);
      })
  )

})

import { AppShutdown } from '@/app/shutdown'
import { base } from '@/config/handleConfigFailure'
import logger from '@/logger'
import { assert } from 'chai'
import sinon, { SinonSpy } from 'sinon'

describe('config/handleConfigFailure', () => {

  let errorSpy: SinonSpy, infoSpy: SinonSpy, shutdown: AppShutdown;
  const error = new Error('FOO_ERR');

  beforeEach(() => {
    shutdown = sinon.fake();
    errorSpy = sinon.stub(logger, 'error');
    infoSpy = sinon.stub(logger, 'info');
  })

  afterEach(() => {
    (logger.error as SinonSpy).restore();
    (logger.info as SinonSpy).restore();
  });

  it('Shuts down the app', () => {
    base(shutdown)(error);
    
    sinon.assert.calledOnce(shutdown as SinonSpy);
  })

  it('Logs the error', () => {
    base(shutdown)(error);
    
    sinon.assert.calledOnceWithExactly(errorSpy, { message: error });
    sinon.assert.calledOnce(infoSpy);
    assert.include(infoSpy.firstCall.args[0], 'Shutting down');
  })

  it('Call order', () => {
    base(shutdown)(error);
    
    assert.isTrue(errorSpy.calledBefore(shutdown as SinonSpy), 'shutdown() must be last call');
    assert.isTrue(infoSpy.calledBefore(shutdown as SinonSpy), 'shutdown() must be last call');
  })

})
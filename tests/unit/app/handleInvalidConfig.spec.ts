import { AppShutdown } from '@/app/shutdown'
import { base } from '@/app/handleInvalidConfig'
import sinon, { SinonSpy } from 'sinon'

describe('app/handleInvalidConfig', () => {

  let shutdown: AppShutdown;
  const error = new Error('FOO_ERR');

  beforeEach(() => {
    shutdown = sinon.fake();
  })

  it('Shuts down the app', () => {
    base(shutdown)(error);
    
    sinon.assert.calledOnce(shutdown as SinonSpy);
  })

})
import { ValidConfigHandler } from '@/app/handleValidConfig'
import { ConfigFailureHandler } from '@/config/handleConfigFailure'
import { ConfigLoader } from '@/loadConfig'
import { base } from '@/runApp'
import { left, right } from 'fp-ts/lib/Either'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from './sampleConfig'

describe('runApp', () => {

  let loadConfigSuccess: ConfigLoader, 
    loadConfigError: ConfigLoader,
    handleValidConfig: ValidConfigHandler, 
    handleInvalidConfig: ConfigFailureHandler;

  const configError = new Error('FOO_ERR');

  beforeEach(() => {
    loadConfigSuccess = sinon.fake.resolves(right(sampleConfig));
    loadConfigError = sinon.fake.resolves(left(configError));
    handleValidConfig = sinon.fake.resolves([]);
    handleInvalidConfig = sinon.fake();
  })

  it('Uses loadConfig()', () =>
    base(loadConfigSuccess, handleValidConfig, handleInvalidConfig)()
      .then(() => {
        sinon.assert.calledOnce(loadConfigSuccess as SinonSpy);
      })
  )

  it('Uses valid config handler', () =>
    base(loadConfigSuccess, handleValidConfig, handleInvalidConfig)()
      .then(() => {
        sinon.assert.calledOnceWithExactly(handleValidConfig as SinonSpy, sampleConfig);
        sinon.assert.notCalled(handleInvalidConfig as SinonSpy);
      })
  )

  it('Uses invalid config handler', () =>
    base(loadConfigError, handleValidConfig, handleInvalidConfig)()
      .then(() => {
        sinon.assert.calledOnceWithExactly(handleInvalidConfig as SinonSpy, configError);
        sinon.assert.notCalled(handleValidConfig as SinonSpy);
      })
  )

})
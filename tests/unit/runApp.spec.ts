import { DaemonStopper, ValidConfigHandler } from '@/app/handleValidConfig'
import { InvalidConfigHandler } from '@/app/handleInvalidConfig'
import { ConfigLoader } from '@/loadConfig'
import { base } from '@/runApp'
import { isLeft, isRight, left, right } from 'fp-ts/lib/Either'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from './sampleConfig'
import { assert } from 'chai'

describe('runApp', () => {

  const daemonStopper: DaemonStopper = Symbol() as unknown as DaemonStopper;
  const validConfigResult = left(daemonStopper);

  let loadConfigSuccess: ConfigLoader, 
    loadConfigError: ConfigLoader,
    handleValidConfig: ValidConfigHandler, 
    handleInvalidConfig: InvalidConfigHandler;

  const configError = new Error('FOO_ERR');

  beforeEach(() => {
    loadConfigSuccess = sinon.fake.resolves(right(sampleConfig));
    loadConfigError = sinon.fake.resolves(left(configError));
    handleValidConfig = sinon.fake.resolves(validConfigResult);
    handleInvalidConfig = sinon.fake();
  })

  it('Uses loadConfig()', () =>
    base(loadConfigSuccess, handleValidConfig, handleInvalidConfig)()
      .then(() => {
        sinon.assert.calledOnce(loadConfigSuccess as SinonSpy);
      })
  )

  describe('When config is valid', () => {
    
    let result;

    beforeEach(async () => result = await base(loadConfigSuccess, handleValidConfig, handleInvalidConfig)())

    it('Uses valid config handler', () => {
      sinon.assert.calledOnceWithExactly(handleValidConfig as SinonSpy, sampleConfig);
      sinon.assert.notCalled(handleInvalidConfig as SinonSpy);
    })

    it('Returns callback|null from handleValidConfig', () => {
      assert.equal(result, validConfigResult);
    })

  })

  describe('When config is invalid', () => {
    
    let result;

    beforeEach(async () => result = await base(loadConfigError, handleValidConfig, handleInvalidConfig)())

    it('Uses invalid config handler', () => {
      sinon.assert.calledOnceWithExactly(handleInvalidConfig as SinonSpy, configError);
      sinon.assert.notCalled(handleValidConfig as SinonSpy);
    })

    it('Returns null result', () => {
      assert.isTrue(isRight(result));
    })

  })

})
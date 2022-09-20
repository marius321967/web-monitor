import { ConfigFailureHandler } from '@/config/handleConfigFailure'
import { ConfigLoader } from '@/loadConfig'
import { base } from '@/runApp'
import { MonitorsStarter } from '@/startMonitors'
import { left, right } from 'fp-ts/lib/Either'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from './sampleConfig'

describe('runApp', () => {

  let loadConfigSuccess: ConfigLoader, loadConfigError: ConfigLoader, startMonitors: MonitorsStarter, handleConfigFailure: ConfigFailureHandler;
  const configError = new Error('FOO_ERR');

  beforeEach(() => {
    loadConfigSuccess = sinon.fake.resolves(right(sampleConfig));
    loadConfigError = sinon.fake.resolves(left(configError));
    startMonitors = sinon.fake.resolves([]);
    handleConfigFailure = sinon.fake();
  })

  it('Uses loadConfig()', () =>
    base(loadConfigSuccess, startMonitors, handleConfigFailure)()
      .then(() => {
        sinon.assert.calledOnce(loadConfigSuccess as SinonSpy);
      })
  )

  it('Uses startMonitors()', () =>
    base(loadConfigSuccess, startMonitors, handleConfigFailure)()
      .then(() => {
        sinon.assert.calledOnceWithExactly(startMonitors as SinonSpy, sampleConfig);
        sinon.assert.notCalled(handleConfigFailure as SinonSpy);
      })
  )

  it('Uses handleConfigFailure()', () =>
    base(loadConfigError, startMonitors, handleConfigFailure)()
      .then(() => {
        sinon.assert.calledOnceWithExactly(handleConfigFailure as SinonSpy, configError);
        sinon.assert.notCalled(startMonitors as SinonSpy);
      })
  )

  it('Puts config in container')

})
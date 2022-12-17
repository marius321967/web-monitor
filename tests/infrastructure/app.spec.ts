import { assert } from 'chai'
import moment from 'moment'
import { Config } from '../../src/config/Config'
import runApp from '../../src/runApp'
import matchLogs from '../utils/matchLogs'
import sampleConfig from './sampleConfig'

describe('app', function() {

  this.timeout(10_000);

  const setConfigEnv = (config: Config) => {
    const configJson = JSON.stringify(config);
    process.env.CONFIG = Buffer.from(configJson).toString('base64');
  }

  afterEach(() => setConfigEnv(sampleConfig))
  
  it('app exits gracefully when monitors list is empty', () => {
    setConfigEnv({ ...sampleConfig, monitors: {} });
    const start = moment();

    return runApp()
      .then(() => Promise.all([
        matchLogs({ message: 'No monitors found in config. Continuing without starting monitoring.' }, { after: start }),
        matchLogs({ message: 'Starting monitoring' }, { after: start }),
      ]))
      .then(([ noopIndicators, opIndicators ]) => {
        assert.lengthOf(noopIndicators, 1, 'Expected to find indication in logs that the app has not started');
        assert.lengthOf(opIndicators, 0, 'Expected to find no indication in logs that the app has started');
      })
  })
  
  it('app continues when monitors list is not empty', () => {
    const start = moment();

    return runApp()
      .then(() => Promise.all([
        matchLogs({ message: 'No monitors found in config. Continuing without starting monitoring.' }, { after: start }),
        matchLogs({ message: 'Starting monitoring' }, { after: start }),
      ]))
      .then(([ noopIndicators, opIndicators ]) => {
        assert.lengthOf(noopIndicators, 0, 'Expected to find no indication in logs that the app is exiting');
        assert.lengthOf(opIndicators, 1, 'Expected to find indication in logs that the app has started');
      })
  })
  
})

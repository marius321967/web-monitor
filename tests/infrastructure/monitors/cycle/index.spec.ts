import registerFailure from '@/monitors/cycle/registerFailure'
import { assert } from 'chai'
import { UniqueMonitorConfig } from '../../../../src/config/Config'
import { setConfig } from '../../../../src/config/container'
import logger from '../../../../src/logger'
import sampleConfig from '../../../unit/sampleConfig'
import matchLogs from '../../../utils/matchLogs'

describe('monitors/cycle', () => {

  const oldDebugLevel = logger.level;

  before(() => logger.level = 'debug');
  after(() => logger.level = oldDebugLevel);

  it('Does not repeat notifications for recurring errors', () => {
    const uniqueEmail = Math.random() + '@example.com';

    setConfig({
      ...sampleConfig,
      notify: {
        admin: { email: uniqueEmail }
      },
      email_notifier: {
        host: 'mail',
        port: 25,
        secure: false,
        auth: { user: 'mr', pass: 'foo' }
      }
    })

    const uniqueConfig: UniqueMonitorConfig = { id: 'contact_form', payload: sampleConfig.monitors.contact_form };
    const error = new Error('FOO_ERR');

    return registerFailure(uniqueConfig, error)
      .then(() => registerFailure(uniqueConfig, error))
      .then(() => matchLogs({ message: 'Sent email notification', email: uniqueEmail }))
      .then(lines => assert.lengthOf(lines, 1, 'expected notification to be sent once'))
  })

})

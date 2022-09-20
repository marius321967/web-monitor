import { MailConfigGetter } from '@/config/container'
import sinon from 'sinon'
import sampleConfig from 'tests/unit/sampleConfig'
import { base } from '@/notifications/agents/nodemailer/getTransport'
import { assert } from 'chai'
import { Options } from 'nodemailer/lib/mailer'

describe('notifications/agents/nodemailer/getTransport', () => {

  let getMailConfig: MailConfigGetter;

  beforeEach(() => {
    getMailConfig = sinon.fake.returns(sampleConfig.email_notifier);
  })

  it('Creates nodemailer transport from config', () => {
    const transport = base(getMailConfig)();

    assert.isNotNull(transport);
    assert.equal(transport.options, sampleConfig.email_notifier as Options);
  })

})

import { base } from '@/notifications/agents/email'
import { TransportGetter } from '@/notifications/agents/nodemailer/getTransport'
import { NotificationContext } from '@/notifications/sendNotification'
import { assert } from 'chai'
import { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from 'tests/unit/sampleConfig'

describe('notifications/agents/email', () => {

  let transport: Transporter, getTransport: TransportGetter;

  const recipient = 'foo@bar.com';
  const context: NotificationContext = {
    uniqueMonitorConfig: { id: 'ssl', payload: sampleConfig.monitors.ssl },
    error: new Error('This is a sample error')
  };

  beforeEach(() => {
    transport = {
      sendMail: sinon.fake.resolves(undefined)
    } as unknown as Transporter;

    getTransport = sinon.fake.returns(transport);
  })

  it('Uses getTransport()', () => 
    base(getTransport)(recipient, context)
      .then(() => {
        sinon.assert.calledOnce(getTransport as SinonSpy);
      })
  )

  it('Sends only to intended recipient', () => 
    base(getTransport)(recipient, context)
      .then(() => {
        sinon.assert.calledOnce(transport.sendMail as SinonSpy);

        const options: Mail.Options = (transport.sendMail as SinonSpy).firstCall.args[0];
        assert.equal(options.to, recipient);
      })
  )

  it('Text with error details', () => 
    base(getTransport)(recipient, context)
      .then(() => {
        sinon.assert.calledOnce(transport.sendMail as SinonSpy);

        const options: Mail.Options = (transport.sendMail as SinonSpy).firstCall.args[0];
        assert.include(options.text, 'This is a sample error');
        assert.include(options.text, 'ssl'); // id
        assert.include(options.text, 'SSL'); // label
      })
  )

  it('Text has multiple lines', () => 
    base(getTransport)(recipient, context)
      .then(() => {
        sinon.assert.calledOnce(transport.sendMail as SinonSpy);

        const options: Mail.Options = (transport.sendMail as SinonSpy).firstCall.args[0];
        assert.include(options.text, '\n')
      })
  )

  it('Subject', () => 
    base(getTransport)(recipient, context)
      .then(() => {
        sinon.assert.calledOnce(transport.sendMail as SinonSpy);

        const options: Mail.Options = (transport.sendMail as SinonSpy).firstCall.args[0];
        assert.equal(options.subject, '[ssl] Error caught by web-monitor'); // id
      })
  )

  it('No HTML', () => 
    base(getTransport)(recipient, context)
      .then(() => {
        sinon.assert.calledOnce(transport.sendMail as SinonSpy);

        const options: Mail.Options = (transport.sendMail as SinonSpy).firstCall.args[0];
        assert.doesNotHaveAllKeys(options, ['html'])
      })
  )

})
import { assert } from "chai";
import { Recipient } from "../../../src/config/Config";
import { setConfig } from "../../../src/config/container"
import sendNotification, { NotificationContext } from "../../../src/notifications/sendNotification";
import sampleConfig from "../../unit/sampleConfig"

describe('notifications/sendNotification', function() {

  this.timeout(10_000);

  it('Rejects when sending to nonexisting host', () => {
    setConfig({
      ...sampleConfig,
      email_notifier: {
        host: 'foo.bar',
        port: 25,
        auth: { user: 'foo', pass: 'bar' }
      }
    });
    
    const recipient: Recipient = { email: 'mr.foo@example.com' };
    const context: NotificationContext = {
      error: new Error('FOO_ERR'),
      uniqueMonitorConfig: { id: 'contact_form', payload: sampleConfig.monitors.contact_form }
    };

    return sendNotification(recipient, context)
      .then(() => assert.fail('Expected to fail'))
      .catch(() => {});
  })

})

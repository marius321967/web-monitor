import { UniqueMonitorConfig } from '@/config/Config'
import { RecipientsGetter } from '@/config/container'
import { NotificationSender } from '@/notifications/sendNotification'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../sampleConfig'
import { base } from '@/notifications/sendNotifications'

describe('notifications/sendNotifications', () => {

  let getRecipients: RecipientsGetter, sendNotification: NotificationSender;
  const uniqueMonitorConfig = { id: 'foo', payload: {} } as UniqueMonitorConfig;
  const error = new Error('FOO_ERR');

  const recipients = sampleConfig.notify;

  beforeEach(() => {
    getRecipients = sinon.fake.returns(recipients);
    sendNotification = sinon.fake.resolves(undefined);
  })

  it('Uses getRecipients()', () => 
    base(getRecipients, sendNotification)(uniqueMonitorConfig, error)
      .then(() => {
        sinon.assert.calledOnce(getRecipients as SinonSpy);
      })
  )

  it('Notifies each recipient', () => 
    base(getRecipients, sendNotification)(uniqueMonitorConfig, error)
      .then(() => {
        sinon.assert.calledTwice(sendNotification as SinonSpy);
        sinon.assert.calledWithExactly(sendNotification as SinonSpy, recipients.admin, uniqueMonitorConfig, error);
        sinon.assert.calledWithExactly(sendNotification as SinonSpy, recipients.developer_1, uniqueMonitorConfig, error);
      })
  )

})
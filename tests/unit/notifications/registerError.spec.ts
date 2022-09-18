import { NotificationsSender } from '@/notifications/sendNotifications'
import { ErrorNotificationFilter } from '@/notifications/shouldNotifyError'
import { base } from '@/notifications/registerError'
import sinon, { SinonSpy } from 'sinon'


describe('notifications/registerError', () => {

  let shouldNotifyError: ErrorNotificationFilter, sendNotifications: NotificationsSender;
  const montorId = 'foo';
  const error = new Error('FOO_ERR');

  beforeEach(() => {
    shouldNotifyError = sinon.fake.resolves(true);
    sendNotifications = sinon.fake.resolves(undefined);
  })

  it('Uses shouldNotifyError()', () => 
    base(shouldNotifyError, sendNotifications)(montorId, error)
      .then(() => {
        sinon.assert.calledOnce(shouldNotifyError as SinonSpy);
      })
  )

  it('Sends notifications if should report', () => 
    base(shouldNotifyError, sendNotifications)(montorId, error)
      .then(() => {
        sinon.assert.calledOnceWithExactly(sendNotifications as SinonSpy, error);
      })
  )

  it('Does not send notifications if should not report', () => {
    shouldNotifyError = sinon.fake.resolves(false);

    return base(shouldNotifyError, sendNotifications)(montorId, error)
      .then(() => {
        sinon.assert.notCalled(sendNotifications as SinonSpy);
      })
  })

})
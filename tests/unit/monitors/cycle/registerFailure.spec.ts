import { ErrorRegistration as NotificationErrorRegistrator } from '@/notifications/registerError'
import { FailingCheckRegistrator as StatusFailingCheckRegistrator } from '@/monitors/statusRegistry'
import { base } from '@/monitors/cycle/registerFailure'
import sampleConfig from '../../sampleConfig'
import sinon, { SinonSpy } from 'sinon'
import { assert } from 'chai'

describe('monitors/cycle/registerFailure', () => {

  const uniqueConfig = { id: 'contact_form', payload: sampleConfig.monitors.contact_form };
  const error = new Error('FOO_ERR');

  let notificationRegister: NotificationErrorRegistrator, updateStatus: StatusFailingCheckRegistrator;

  beforeEach(() => {
    notificationRegister = sinon.fake.resolves(undefined);
    updateStatus = sinon.fake();
  })

  it('Uses notificationRegister()', () =>
    base(notificationRegister, updateStatus)(uniqueConfig, error)
      .then(() => {
        sinon.assert.calledOnceWithExactly(notificationRegister as SinonSpy, uniqueConfig, error);
      })
  )

  it('Uses updateStatus() afterwards', () =>
    base(notificationRegister, updateStatus)(uniqueConfig, error)
      .then(() => {
        sinon.assert.calledOnceWithExactly(updateStatus as SinonSpy, 'contact_form', error);
        assert.isTrue((updateStatus as SinonSpy).calledAfter(notificationRegister as SinonSpy));
      })
  )

})

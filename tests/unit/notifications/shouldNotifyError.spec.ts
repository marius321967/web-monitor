import { base } from '@/notifications/shouldNotifyError'
import { RecurringErrorChecker } from '@/monitors/statusRegistry'
import sinon, { SinonSpy } from 'sinon'
import { assert } from 'chai'

describe('notifications/shouldNotifyError', () => {

  const monitorId = 'foo';
  const error = new Error('FOO_ERR');

  let isRecurringError: RecurringErrorChecker;

  beforeEach(() => {
    isRecurringError = sinon.fake.returns(true);
  })

  it('Uses isRecurringError()', () => 
    base(isRecurringError)(monitorId, error)
      .then(() => {
        sinon.assert.calledOnceWithExactly(isRecurringError as SinonSpy, monitorId, error);
      })
  )

  it('Should notify if error is not recurring', () => {
    isRecurringError = sinon.fake.returns(false);

    return base(isRecurringError)(monitorId, error)
      .then(result => assert.isTrue(result));
  })

  it('Should not notify if error is recurring', () => {
    isRecurringError = sinon.fake.returns(true);

    return base(isRecurringError)(monitorId, error)
      .then(result => assert.isFalse(result));
  })

})

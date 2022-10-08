import { base } from '@/notifications/shouldNotifyError'
import { RecurringErrorChecker } from '@/monitors/statusRegistry'
import sinon, { SinonSpy } from 'sinon'
import { assert } from 'chai'

describe('notifications/shouldNotifyError', () => {

  const monitorId = 'foo';
  const error = new Error('FOO_ERR');

  let isRecurringError: RecurringErrorChecker;
  let resultToken: boolean;

  beforeEach(() => {
    resultToken = Symbol() as unknown as boolean;
    isRecurringError = sinon.fake.returns(resultToken);
  })

  it('Uses isRecurringError()', () => 
    base(isRecurringError)(monitorId, error)
      .then(() => {
        sinon.assert.calledOnceWithExactly(isRecurringError as SinonSpy, monitorId, error);
      })
  )

  it('Returns result from isRecurringError()', () => 
    base(isRecurringError)(monitorId, error)
      .then(result => {
        assert.equal(result, resultToken);
      })
  )

})

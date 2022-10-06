import { registerSuccess, registerError, isRecurringError } from '@/monitors/statusRegistry'
import { expect } from 'chai'

describe('monitors/statusRegistry', () => {

  it('Testing all functions', () => {
    const monitorId = 'foo';
    const error = new Error('FOO_ERR');
    
    expect(isRecurringError(monitorId, error)).to.be.false;
    
    registerError(monitorId, error);

    expect(isRecurringError(monitorId, error)).to.be.true;
    expect(isRecurringError('bar', error)).to.be.false;

    registerSuccess(monitorId);

    expect(isRecurringError(monitorId, error)).to.be.false;
  })

  it('isRecurringError() returns false if previous error message was different', () => {
    const monitorId = 'foo';
    const firstError = new Error('FOO_ERR');
    const secondError = new Error('BAR_ERR');
    
    registerError(monitorId, firstError);

    expect(isRecurringError(monitorId, firstError)).to.be.true;
    expect(isRecurringError(monitorId, secondError)).to.be.false;

    registerError(monitorId, secondError);

    expect(isRecurringError(monitorId, firstError)).to.be.false;
    expect(isRecurringError(monitorId, secondError)).to.be.true;
  })

})
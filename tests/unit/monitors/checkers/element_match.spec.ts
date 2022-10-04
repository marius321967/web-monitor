import { ElementMatchMonitor, MonitorType } from '@/config/Config'
import { AxiosSender } from '@/monitors/requests/sendAxiosRequest'
import { responseWithData } from './sampleResponse'
import { base } from '@/monitors/checkers/element_match'
import sinon, { SinonSpy } from 'sinon'
import { HTMLSelectorMatcher } from '@/monitors/checkers/element_match/selectorMatches'
import { assert } from 'chai'

describe('monitors/checkers/element_match', () => {

  let sendAxiosRequest: AxiosSender, sendAxiosRequestError: AxiosSender,
    selectorMatchesTrue: HTMLSelectorMatcher, selectorMatchesFalse: HTMLSelectorMatcher;
  
  const response = responseWithData('some HTML');
  const requestError = new Error('FOO_ERR');

  const monitor: ElementMatchMonitor = {
    label: 'Foo',
    type: MonitorType.element_match,
    interval: '1 day',
    pattern: 'body > .foo',
    request: 'http://foo.com',
  }

  beforeEach(() => {
    sendAxiosRequest = sinon.fake.resolves(response);
    sendAxiosRequestError = sinon.fake.rejects(requestError);
    selectorMatchesTrue = sinon.fake.returns(true);
    selectorMatchesFalse = sinon.fake.returns(false);
  })

  it('Sends request', () => 
    base(sendAxiosRequest, selectorMatchesTrue)(monitor)
      .then(() => {
        sinon.assert.calledOnceWithExactly(sendAxiosRequest as SinonSpy, 'http://foo.com');
      })
  )

  it('Searches for element', () => 
    base(sendAxiosRequest, selectorMatchesTrue)(monitor)
      .then(() => {
        sinon.assert.calledOnceWithExactly(selectorMatchesTrue as SinonSpy, 'body > .foo', 'some HTML');
      })
  )

  it('Ignores when match succeeds', () => 
    base(sendAxiosRequest, selectorMatchesTrue)(monitor)
      .then(result => {
          assert.isNull(result);
      })
  )

  it('Reports when match fails', () => 
    base(sendAxiosRequest, selectorMatchesFalse)(monitor)
      .then(result => {
        assert.isNotNull(result);
        
        assert.include((result as Error).message, 'Could not find HTML element');
      })
  )

  it(
    'Reports non-string response data (object)',
    () => {
      sendAxiosRequest = sinon.fake.resolves({
        ...responseWithData({ foo: 'bar' }),
        headers: { 'content-type': 'application/json' },

      });

      return base(sendAxiosRequest, selectorMatchesTrue)(monitor)
        .then(error => {
          assert.isNotNull(error);
          assert.equal(error?.message, 'Received non-string response (application/json)');

          sinon.assert.notCalled(selectorMatchesTrue as SinonSpy);
        })
    }
  )

  it('Reports response-less errors', () =>
    base(sendAxiosRequestError, selectorMatchesFalse)(monitor)
      .then(result => {
        assert.isNotNull(result);
        assert.equal(result, requestError);

        sinon.assert.notCalled(selectorMatchesTrue as SinonSpy);
      })
  )
  
})
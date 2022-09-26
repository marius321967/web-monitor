import { ContentMatchMonitor, MonitorType } from '@/config/Config'
import { base } from '@/monitors/checkers/content_match'
import { assert } from 'chai'
import sinon, { SinonSpy } from 'sinon'
import { AxiosSender } from '@/monitors/requests/sendAxiosRequest'
import { responseWithData } from './sampleResponse'

describe('monitors/checkers/content_match', () => {

  let sendAxiosRequest: AxiosSender;
  const response = responseWithData('Foo bar baz');

  const monitor: ContentMatchMonitor = {
    label: 'Foo',
    type: MonitorType.content_match,
    interval: '1 day',
    pattern: '/^Foo/',
    request: 'http://foo.com',
  }

  const monitorWithPattern = (pattern: string): ContentMatchMonitor => ({ ...monitor, pattern });

  beforeEach(() => {
    sendAxiosRequest = sinon.fake.resolves(response);
  })

  it(
    'Sends request', 
    () => base(sendAxiosRequest)(monitor)
      .then(() => {
        sinon.assert.calledOnceWithExactly(sendAxiosRequest as SinonSpy, 'http://foo.com');
      })
  )

  it(
    'Supports simple match (positive)',
    () => base(sendAxiosRequest)(monitorWithPattern('Foo bar'))
      .then(error => {
        assert.isNull(error);
      })
  )

  it(
    'Supports simple match (negative)',
    () => base(sendAxiosRequest)(monitorWithPattern('Fooz'))
      .then(error => {
        assert.isNotNull(error);
        assert.equal(error?.message, 'Content could not be found');
      })
  )

  it(
    'Supports regex (positive)', 
    () => base(sendAxiosRequest)(monitorWithPattern('/^Foo (w+) baz$/'))
      .then(error => {
        assert.isNotNull(error);
      })
  )

  it(
    'Supports regex (negative)', 
    () => {
      const response = responseWithData('Foo(\\w) bar baz');
    
      sendAxiosRequest = sinon.fake.resolves(response);

      return base(sendAxiosRequest)(monitorWithPattern('/Foo(\\w)/'))
        .then(error => {
          assert.isNotNull(error);
          assert.equal(error?.message, 'Content could not be found');
        })
    }
  )

  it(
    'Reports non-string response data (object)',
    () => {
      sendAxiosRequest = sinon.fake.resolves({
        ...responseWithData({ foo: 'bar' }),
        headers: { 'content-type': 'application/json' }
      });

      return base(sendAxiosRequest)(monitor)
        .then(error => {
          assert.isNotNull(error);
          assert.equal(error?.message, 'Received non-string response (application/json)');
        })
    }
  )

  it(
    'Reports non-string response data (buffer)',
    () => {
      sendAxiosRequest = sinon.fake.resolves({
        ...responseWithData(Buffer.from('foo_bar')),
        headers: { 'content-type': 'image/jpeg' }
      });

      return base(sendAxiosRequest)(monitor)
        .then(error => {
          assert.isNotNull(error);
          assert.equal(error?.message, 'Received non-string response (image/jpeg)');
        })
    }
  )

  it(
    'Reports non-string response data (object / no content-type)',
    () => {
      sendAxiosRequest = sinon.fake.resolves({
        ...responseWithData({ foo: 'bar' }),
        headers: {} // no content-type
      });

      return base(sendAxiosRequest)(monitor)
        .then(error => {
          assert.isNotNull(error);
          assert.equal(error?.message, 'Received non-string response (unknown)');
        })
    }
  )

  it(
    'Ignores axios failures',
    () => {
      const sendAxiosRequest = sinon.fake.rejects(new Error('FOO_ERR'));

      return base(sendAxiosRequest)(monitor)
        .then(error => {
          assert.isNull(error);
        });
    }
  )

})
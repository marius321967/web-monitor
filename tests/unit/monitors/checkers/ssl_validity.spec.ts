import { MonitorType, SslMonitor } from '@/config/Config'
import { base } from '@/monitors/checkers/ssl_validity'
import { AxiosSender } from '@/monitors/requests/sendAxiosRequest'
import { AxiosError } from 'axios'
import { assert } from 'chai'
import sinon, { SinonSpy } from 'sinon'
import { response } from './sampleResponse'

describe('monitors/checkers/ssl_validity', () => {

  let send: AxiosSender, sendErroneous: AxiosSender;

  const genericError = new Error('FOO_ERR');
  const axiosCertError = new AxiosError('Something wrong', 'SOME_CERT_ERROR');
  const axiosNonCertError = new AxiosError('Something wrong', 'CYERT');

  const erroneousSender = (err: Error): AxiosSender => sinon.fake.rejects(err);

  const monitor: SslMonitor = {
    label: 'Foo',
    type: MonitorType.ssl_validity,
    interval: '1 day',
    request: 'https://foo.com',
  };

  beforeEach(() => {
    send = sinon.fake.resolves(response());
    sendErroneous = sinon.fake.rejects(genericError);
  })

  it('Sends request', () => 
    base(send)(monitor)
      .then(() => {
        sinon.assert.calledOnceWithExactly(send as SinonSpy, 'https://foo.com');
      })
  )

  it('Succeeds a complete request', () => 
    base(send)(monitor)
      .then(result => {
        assert.isNull(result);
      })
  )

  it('Fails with SSL-related error', () => 
    base(erroneousSender(axiosCertError))(monitor)
      .then(result => {
        assert.isNotNull(result);
        assert.include(result?.message, 'SOME_CERT_ERROR');
      })
  )

  it('Ignores non-SSL errors', () => 
    base(erroneousSender(axiosNonCertError))(monitor)
      .then(result => {
        assert.isNull(result);
      })
  )

  it('Does not validate whether request is HTTPS (validated elsewhere)', () => 
    base(erroneousSender(axiosNonCertError))({ ...monitor, request: 'http://foo.com' })
      .then(result => {
        assert.isNull(result);
      })
  )

})

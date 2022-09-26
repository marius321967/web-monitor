import { MonitorRequestConfig, RequestMethod } from '@/config/Config';
import { Axios, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import sinon, { SinonSpy } from 'sinon'
import { response as makeResponse, responseWithStatus } from '../checkers/sampleResponse'
import { base } from '@/monitors/requests/sendAxiosRequest'
import { assert } from 'chai';


describe('monitors/requests/sendAxiosRequest', () => {

  let axios: Axios;
  let response: AxiosResponse;
  const request: MonitorRequestConfig = {
    url: 'http://example.com',
    method: RequestMethod.GET,
    auth_header: 'Basic XYZ'
  }

  beforeEach(() => {
    response = makeResponse();
    axios = {
      request: sinon.fake.resolves(response),
    } as unknown as Axios;
  })

  it(
    'Returns axios response', 
    () => base(axios)(request)
      .then(result => {
        assert.equal(result, response);
      })
  )

  it(
    'String request sends GET', 
    () => base(axios)('http://foo.bar.com')
      .then(() => {
        const opts = (axios.request as SinonSpy).firstCall.args[0] as AxiosRequestConfig;

        assert.equal(opts.method, 'GET');
        assert.equal(opts.url, 'http://foo.bar.com');
      })
  )
  
  Object.values(RequestMethod).forEach(method => 
    it(
      `Sends ${method} request`, 
      () => base(axios)(request)
        .then(() => {
          sinon.assert.calledOnce(axios.request as SinonSpy);

          const opts = (axios.request as SinonSpy).firstCall.args[0] as AxiosRequestConfig;
          assert.equal(opts.method, method);
        })
    )
  )

  it(
    'Sends auth header', 
    () => base(axios)(request)
      .then(() => {
        const opts = (axios.request as SinonSpy).firstCall.args[0] as AxiosRequestConfig;

        assert.isObject(opts.headers);
        assert.isString(opts.headers?.Authorization);
        assert.equal(opts.headers?.Authorization, 'Basic XYZ');
      })
  )

  it(
    'Treats 404 response as regular response',
    () => {
      const response = responseWithStatus(404, 'Not Found');
      const error = new AxiosError('Foo error', 'FOO_ERR', undefined, undefined, response);
  
      axios = {
        request: sinon.fake.rejects(error),
      } as unknown as Axios;

      return base(axios)(request)
        .then(result => {
          assert.equal(result, response);
        })
    }
  )

  it(
    'Treats 500 response as regular response',
    () => {
      const response = responseWithStatus(500, 'Internal Server Error');
      const error = new AxiosError('Foo error', 'FOO_ERR', undefined, undefined, response);
  
      axios = {
        request: sinon.fake.rejects(error),
      } as unknown as Axios;

      return base(axios)(request)
        .then(result => {
          assert.equal(result, response);
        })
    }
  )

  it(
    'Treats response-less failure as error',
    () => {
      const error = new AxiosError('Foo error', 'FOO_ERR');
  
      axios = {
        request: sinon.fake.rejects(error),
      } as unknown as Axios;

      return base(axios)(request)
        .then(() => assert.fail('Expected to reject'))
        .catch(result => {
          assert.equal(result, error);
        })
    }
  )

})
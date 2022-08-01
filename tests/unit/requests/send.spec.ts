import axios, { AxiosStatic, AxiosRequestConfig, AxiosResponse } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import sinon, { SinonSpy } from 'sinon'
import { assert } from 'chai'
import { MonitorRequestConfig, RequestMethod } from '@/config/Config'
import send, { base } from '@/requests/send'

describe('requests/send', () => {
  
  // let axios: AxiosStatic;
  let axiosMock;
  // let axiosSpied: { request: SinonSpy };
  let axiosSpied: AxiosStatic;

  const response: AxiosResponse<string> = {
    data: 'Sample response',
    config: {},
    headers: {},
    status: 200,
    statusText: 'OK',
  }

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    axiosSpied = { request: sinon.fake.resolves(response) } as unknown as AxiosStatic;
  })

  afterEach(() => {
    axiosMock.restore();

  })

  Object.values(RequestMethod).forEach(method => 
    it(`Sends ${method} request`, done => {
      const monitorRequest: MonitorRequestConfig = { url: 'http://example.com', method };
      const send = base(axiosSpied as AxiosStatic);

      send(monitorRequest)
        .then(() => {
          sinon.assert.calledOnce(axiosSpied.request as SinonSpy);

          const opts = (axiosSpied.request as SinonSpy).firstCall.args[0] as AxiosRequestConfig;
          assert.equal(opts.method, method);
          
          done();
        })
        .catch(done)
    })
  );
  
  it('Sends auth header')

  it('Sends to requested URL')

  it('Treats 404 response as regular response')
  it('Treats 500 response as regular response')

  it('Treats unknown host failure as error')

})
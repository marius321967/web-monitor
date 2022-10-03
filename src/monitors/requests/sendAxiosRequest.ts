import { MonitorRequestConfig, MonitorRequestConfigComplex } from '@/config/Config'
import axios, { AxiosResponse, Axios, AxiosRequestConfig, AxiosError } from 'axios'
import { Either } from 'fp-ts/lib/Either'
import { isString } from 'fp-ts/lib/string'
import { always, cond } from 'ramda'

/**
 * Resolves even if response code gives error.
 * Rejects if no response.
 */
export type AxiosSender = (request: MonitorRequestConfig) => Promise<AxiosResponse>

/** Error-code responses are returned as responses, not errors */
export type RequestSender = (request: MonitorRequestConfig) => Promise<Either<Error, AxiosResponse>>

const headerOpts = (authHeader: string | undefined): { Authorization: string } | {} =>
  (isString(authHeader))
    ? { Authorization: authHeader }
    : {};

const optsFromString = (url: string): AxiosRequestConfig => ({ url, method: 'GET' });

const optsFromObject = (config: MonitorRequestConfigComplex): AxiosRequestConfig => ({ 
    url: config.url, 
    method: config.method,
    headers: headerOpts(config.auth_header)
});

const opts: ((request: MonitorRequestConfig) => AxiosRequestConfig) = cond([
    [ isString,     optsFromString ],
    [ always(true), optsFromObject ]
])

const handleAxiosError = (err: AxiosError): Promise<AxiosResponse> =>
  (err.response)
    ? Promise.resolve(err.response)
    : Promise.reject(err)

const handleError = (err: Error | AxiosError): Promise<AxiosResponse> =>
  (err instanceof AxiosError)
    ? handleAxiosError(err)
    : Promise.reject(err);

export const base = 
  (axios: Axios): AxiosSender =>
  (request) => 
    axios.request(opts(request))
      .catch(handleError)

export default base(axios)

import { MonitorRequestConfig, MonitorRequestConfigComplex } from '@/config/Config'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'
import { Either, left } from 'fp-ts/lib/Either'
import { isString } from 'fp-ts/lib/string'
import { always, cond } from 'ramda'

/** Error-code responses are returned as responses, not errors */
export type RequestSender = (request: MonitorRequestConfig) => Promise<Either<Error, AxiosResponse>>

const optsFromString = (url: string): AxiosRequestConfig => ({ url, method: 'GET' });
const optsFromObject = (config: MonitorRequestConfigComplex): AxiosRequestConfig => ({ 
    url: config.url, 
    method: config.method,
});

const opts: ((request: MonitorRequestConfig) => AxiosRequestConfig) = cond([
    [ isString,     optsFromString ],
    [ always(true), optsFromObject ]
])

export const base = 
    (axios: AxiosStatic): RequestSender =>
    (request: MonitorRequestConfig) => 
        axios.request(opts(request))

export default base(axios);

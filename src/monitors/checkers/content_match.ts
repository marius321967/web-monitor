import { ContentMatchMonitor } from '@/config/Config'
import { AxiosResponse } from 'axios'
import { pipe } from 'fp-ts/lib/function'
import { isString } from 'fp-ts/lib/string'
import sendAxiosRequest, { AxiosSender } from '@/monitors/requests/sendAxiosRequest'
import { MonitorChecker } from './MonitorChecker'
import buildRegex from './content_match/buildRegex'

const contentType = (response: AxiosResponse): string => (response.headers['content-type'])
  ? response.headers['content-type']
  : 'unknown';

const validateContentType = (response: AxiosResponse): Error | null => (isString(response.data))
  ? null
  : new Error(`Received non-string response (${contentType(response)})`);

const isRegex = (pattern: string): boolean => (pattern.startsWith('/') && pattern.endsWith('/'));

const validateContentRegex = (pattern: string, data: string): Error | null => 
  buildRegex(pattern).test(data)
    ? null
    : new Error('Content could not be found');

const validateContentPlain = (pattern: string, data: string): Error | null => 
  (data.includes(pattern))
    ? null
    : new Error('Content could not be found');

const validateContent = (pattern: string, data: string): Error | null => (isRegex(pattern))
  ? validateContentRegex(pattern, data)
  : validateContentPlain(pattern, data);

const failOrValidateContent = (pattern: string, response: AxiosResponse) => (error: Error | null): Error | null => (error)
  ? error
  : validateContent(pattern, response.data);

const validateResponse = 
  (pattern: string) =>
  (response: AxiosResponse): Error | null => pipe(
    validateContentType(response),
    failOrValidateContent(pattern, response)
  );

export const base = 
  (sendAxiosRequest: AxiosSender): MonitorChecker<ContentMatchMonitor> =>
  (monitor) => 
    sendAxiosRequest(monitor.request)
      .then(validateResponse(monitor.pattern))
      .catch(err => null);

export default base(sendAxiosRequest)

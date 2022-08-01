import { MonitorConfig, MonitorType } from '@/config/Config'
import axios, { AxiosStatic, AxiosResponse, AxiosError } from 'axios'
import { MonitorChecker } from './MonitorChecker'
import { always, cond, equals } from 'ramda'
import { flow } from 'fp-ts/lib/function'

const isExpectedCode = (code: number) => (response: AxiosResponse): boolean => equals(response.status, code);

const getResponse = (error: AxiosError): AxiosResponse => error.response;

const throwUnexpectedCode = (response: AxiosResponse) => new Error(`Received an unexpected response code: ${response.status}`);
const throwUnexpectedCodeFromError = flow(getResponse, throwUnexpectedCode);

const handleSuccess = (expected: number) => cond([
    [ isExpectedCode(expected), always(null) ],
    [ always(true),             throwUnexpectedCode ]
]);

const hasNoResponse = (error: Error | AxiosError): boolean => !('response' in error);

const handleError = (expected: number) => cond([
    [ hasNoResponse,                                (err) => err ],
    [ flow(getResponse, isExpectedCode(expected)),  always(null) ],
    [ always(true),                                 throwUnexpectedCodeFromError ]
]);

export const base = 
    (axios: AxiosStatic): MonitorChecker<MonitorConfig & { type: MonitorType.response_code }> =>
    (monitor) => axios.get(monitor.request as string)
        .then(handleSuccess(monitor.expected_code))
        .catch(handleError(monitor.expected_code))

export default base(axios)

import { ElementMatchMonitor } from '@/config/Config'
import { AxiosResponse } from 'axios'
import { isString } from 'fp-ts/lib/string'
import sendAxiosRequest, { AxiosSender } from '../requests/sendAxiosRequest'
import selectorMatches, { HTMLSelectorMatcher } from './element_match/selectorMatches'
import { MonitorChecker } from './MonitorChecker'

const validateContentType: (response: AxiosResponse) => Promise<AxiosResponse> = (response) => 
  (isString(response.data))
    ? Promise.resolve(response)
    : Promise.reject(new Error(`Received non-string response (${response.headers['content-type']})`));

export const base = 
  (sendAxiosRequest: AxiosSender, selectorMatches: HTMLSelectorMatcher): MonitorChecker<ElementMatchMonitor> =>
  (monitor) => 
    sendAxiosRequest(monitor.request)
      .then(validateContentType)
      .then(response => 
        (selectorMatches(monitor.pattern, response.data))
          ? Promise.resolve(null)
          : Promise.reject(new Error('Could not find HTML element'))
      )
      .catch(err => err)

export default base(sendAxiosRequest, selectorMatches)

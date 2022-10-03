import { ResponseTimeMonitor } from '@/config/Config'
import { AxiosResponse } from 'axios';
import intervalToMs, { IntervalToMsConverter } from '../IntervalToMs'
import sendAxiosRequest, { AxiosSender } from '../requests/sendAxiosRequest'
import { MonitorChecker } from './MonitorChecker'

type Resolver = (result: Error | null) => void;

const raceTimeout = (resolve: Resolver, timeout: number) => 
  setTimeout(
    () => resolve(new Error('Request took too long')), 
    timeout
  );

type SendJob = Promise<AxiosResponse>;

const raceSend = (resolve: Resolver, job: SendJob) =>
  job
    .then(() => resolve(null))
    .catch(err => resolve(err));

// Note: js Promises ignore repeated resolves and rejects, 
// so we don't need a proprietary lock mechanism in our race condition
export const base = 
  (send: AxiosSender, intervalToMs: IntervalToMsConverter): MonitorChecker<ResponseTimeMonitor> =>
  (monitor) => 
    new Promise(resolve => {
      const timeout = intervalToMs(monitor.threshold);
      
      raceSend(resolve, send(monitor.request));
      raceTimeout(resolve, timeout);
    });

export default base(sendAxiosRequest, intervalToMs)

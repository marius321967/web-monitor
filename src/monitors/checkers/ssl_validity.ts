import { SslMonitor } from '@/config/Config'
import { AxiosError } from 'axios';
import sendAxiosRequest, { AxiosSender } from '../requests/sendAxiosRequest'
import { MonitorChecker } from './MonitorChecker'

// todo
export const base = 
  (send: AxiosSender): MonitorChecker<SslMonitor> =>
  (monitor) => 
    send(monitor.request)
      .then(() => null)
      .catch(err => 
        ((err as AxiosError).code?.includes('CERT'))
          ? err
          : null
      )

export default base(sendAxiosRequest)

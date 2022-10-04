import { SslMonitor } from '@/config/Config'
import { AxiosError } from 'axios';
import sendAxiosRequest, { AxiosSender } from '../requests/sendAxiosRequest'
import { MonitorChecker } from './MonitorChecker'

export const base = 
  (send: AxiosSender): MonitorChecker<SslMonitor> =>
  (monitor) => 
    send(monitor.request)
      .then(() => null)
      .catch((err: AxiosError) => 
        (err.code?.includes('CERT'))
          ? new Error(`Error code: ${err.code}`)
          : null
      )

export default base(sendAxiosRequest)

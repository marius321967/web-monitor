import { SslMonitor } from '@/config/Config'
import { MonitorChecker } from './MonitorChecker'

export const base = 
    (): MonitorChecker<SslMonitor> =>
    (monitor) => Promise.resolve(null)

export default base()
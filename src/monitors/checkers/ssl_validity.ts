import { SslMonitor } from '@/config/Config'
import { MonitorChecker } from './MonitorChecker'

// todo
export const base = 
    (): MonitorChecker<SslMonitor> =>
    (monitor) => Promise.resolve(null)

export default base()
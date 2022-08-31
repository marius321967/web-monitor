import { ResponseTimeMonitor } from '@/config/Config'
import { MonitorChecker } from './MonitorChecker'

// todo
export const base = 
    (): MonitorChecker<ResponseTimeMonitor> =>
    (monitor) => Promise.resolve(null)

export default base()
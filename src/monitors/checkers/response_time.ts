import { ResponseTimeMonitor } from '@/config/Config'
import { MonitorChecker } from './MonitorChecker'

export const base = 
    (): MonitorChecker<ResponseTimeMonitor> =>
    (monitor) => Promise.resolve(null)

export default base()
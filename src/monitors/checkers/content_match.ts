import { ContentMatchMonitor } from '@/config/Config'
import { MonitorChecker } from './MonitorChecker'

export const base = 
    (): MonitorChecker<ContentMatchMonitor> =>
    (monitor) => Promise.resolve(null)

export default base()
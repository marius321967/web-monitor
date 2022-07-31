import { Config } from './config/Config'
import { MonitorCanceler } from './monitors/CancelMonitor'
import startMonitor, { MonitorStarter } from './monitors/startMonitor'

export type MonitorsStarter = (config: Config) => Promise<MonitorCanceler[]>

// todo
export const base = 
    (startMonitor: MonitorStarter): MonitorsStarter =>
    (config) => Promise.resolve([]);

export default base(startMonitor)
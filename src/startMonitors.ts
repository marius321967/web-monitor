import { Config } from './config/Config'
import { MonitorStopper } from './monitors/MonitorStopper'
import startMonitor, { MonitorStarter } from './monitors/startMonitor'

export type MonitorsStarter = (config: Config) => Promise<MonitorStopper[]>

// todo
export const base = 
    (startMonitor: MonitorStarter): MonitorsStarter =>
    (config) => Promise.resolve([]);

export default base(startMonitor)
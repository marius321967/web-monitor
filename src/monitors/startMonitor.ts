import { MonitorConfig } from '../config/Config'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'
import { MonitorStopper } from './MonitorStopper'

export type MonitorStarter = (monitorConfig: MonitorConfig) => Promise<MonitorStopper>

export const base =
    (monitorCheckerRegistry: MonitorCheckerMap): MonitorStarter =>
    (monitorConfig) => Promise.resolve(null);

// todo
export default base(monitorCheckerRegistry)

import { flow } from 'fp-ts/function'
import { map } from 'fp-ts/Array'
import { values } from 'ramda'
import { Config } from './config/Config'
import { MonitorStopper } from './monitors/MonitorStopper'
import startMonitor, { MonitorStarter } from './monitors/startMonitor'

export type MonitorsStarter = (config: Config) => Promise<MonitorStopper[]>

export const base = 
  (startMonitor: MonitorStarter): MonitorsStarter =>
  flow(
    (config) => config.monitors,
    values,
    map(startMonitor),
    promises => Promise.all(promises)
  )

export default base(startMonitor)

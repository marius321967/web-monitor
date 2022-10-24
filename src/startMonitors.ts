import { flow } from 'fp-ts/function'
import { map } from 'fp-ts/Array'
import { tap, toPairs } from 'ramda'
import { Config, MonitorConfig, UniqueMonitorConfig } from './config/Config'
import { MonitorStopper } from './monitors/MonitorStopper'
import startMonitor, { MonitorStarter } from './monitors/startMonitor'
import logger from './logger'

export type MonitorsStarter = (config: Config) => Promise<MonitorStopper[]>

type ConfigEntry = [ key: string, item: MonitorConfig ];

const log = (): void => logger.info('Starting monitoring') && undefined;

const toUniqueConfigs = map<ConfigEntry, UniqueMonitorConfig>(([ id, payload ]) => ({ id, payload }));

export const base = 
  (startMonitor: MonitorStarter): MonitorsStarter =>
  flow(
    (config) => config.monitors,
    toPairs,
    toUniqueConfigs,
    tap(log),
    map(startMonitor),
    promises => Promise.all(promises)
  )

export default base(startMonitor)

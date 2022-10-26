import { Config } from '@/config/Config'
import { ConfigSetter, setConfig } from '@/config/container'
import { MonitorStopper } from '@/monitors/MonitorStopper'
import startMonitors, { MonitorsStarter } from '@/startMonitors'

export type ValidConfigHandler = (config: Config) => Promise<MonitorStopper[]>

export const base =
  (setConfig: ConfigSetter, startMonitors: MonitorsStarter): ValidConfigHandler =>
  (config) => {
    setConfig(config);

    return startMonitors(config);
  }

export default base(setConfig, startMonitors)

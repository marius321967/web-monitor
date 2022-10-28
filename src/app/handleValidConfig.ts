import { Config } from '@/config/Config'
import { ConfigSetter, setConfig } from '@/config/container'
import startMonitors, { MonitorsStarter } from '@/startMonitors'
import setupTerminationHandler, { TerminationHandlerSetup } from './exit/setupTerminationHandler'

export type ValidConfigHandler = (config: Config) => Promise<void>

export const base =
  (setConfig: ConfigSetter, startMonitors: MonitorsStarter, setupTerminationHandler: TerminationHandlerSetup): ValidConfigHandler =>
  (config) => {
    setConfig(config);

    return startMonitors(config)
      .then(setupTerminationHandler);
  }

export default base(setConfig, startMonitors, setupTerminationHandler)

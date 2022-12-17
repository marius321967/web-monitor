import { Config } from '@/config/Config'
import { ConfigSetter, setConfig } from '@/config/container'
import startMonitors, { MonitorsStarter } from '@/startMonitors'
import { keys } from 'ramda'
import logger from '../logger'
import setupTerminationHandler, { TerminationHandlerSetup } from './exit/setupTerminationHandler'

export type ValidConfigHandler = (config: Config) => Promise<void>

const hasNoMonitors = (config: Config): boolean => keys(config.monitors).length == 0;

export const base =
  (setConfig: ConfigSetter, startMonitors: MonitorsStarter, setupTerminationHandler: TerminationHandlerSetup): ValidConfigHandler =>
  (config) => {
    if (hasNoMonitors(config)) {
      logger.info('No monitors found in config. Continuing without starting monitoring.');
      return Promise.resolve();
    }

    setConfig(config);
    
    return startMonitors(config)
      .then(setupTerminationHandler);
  }

export default base(setConfig, startMonitors, setupTerminationHandler)

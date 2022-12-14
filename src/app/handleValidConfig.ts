import { Config } from '@/config/Config'
import { ConfigSetter, setConfig } from '@/config/container'
import startMonitors, { MonitorsStarter } from '@/startMonitors'
import { Either, left, right } from 'fp-ts/lib/Either'
import { keys } from 'ramda'
import logger from '../logger'
import setupTerminationHandler, { TerminationHandlerSetup } from './exit/setupTerminationHandler'

export type DaemonStopper = () => void;

/** Callback for stopping any initiated daemons */
export type ValidConfigHandler = (config: Config) => Promise<Either<DaemonStopper, null>>;

const hasNoMonitors = (config: Config): boolean => keys(config.monitors).length == 0;

export const base =
  (setConfig: ConfigSetter, startMonitors: MonitorsStarter, setupTerminationHandler: TerminationHandlerSetup): ValidConfigHandler =>
  (config) => {
    if (hasNoMonitors(config)) {
      logger.info('No monitors found in config: closing');
      return Promise.resolve( right(null) );
    }

    setConfig(config);
    
    return startMonitors(config)
      .then(setupTerminationHandler)
      .then(handler => left(handler));
  }

export default base(setConfig, startMonitors, setupTerminationHandler)

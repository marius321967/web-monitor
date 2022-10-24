import loadConfig, { ConfigLoader } from './loadConfig'
import handleConfigFailure, { InvalidConfigHandler } from './app/handleInvalidConfig'
import { fold } from 'fp-ts/lib/Either'
import handleValidConfig, { ValidConfigHandler } from './app/handleValidConfig'
import { flow } from 'fp-ts/lib/function'
import logger from './logger'
import { Config } from './config/Config'

export type AppRunner = () => Promise<void>;

const logConfigFail = (err: Error): Error => logger.error({ message: err }) && err;
const logConfigOk = (config: Config): Config => logger.debug('Configuration is valid') && config;

const startOrFail = (handleValidConfig: ValidConfigHandler, handleInvalidConfig: InvalidConfigHandler) => 
  fold(
    flow(logConfigFail, handleInvalidConfig),
    flow(logConfigOk, handleValidConfig),
  );

export const base = 
  (loadConfig: ConfigLoader, handleValidConfig: ValidConfigHandler, handleInvalidConfig: InvalidConfigHandler): AppRunner => 
  () => loadConfig().then(startOrFail(handleValidConfig, handleInvalidConfig));

export default base(loadConfig, handleValidConfig, handleConfigFailure)

import loadConfig, { ConfigLoader } from './loadConfig'
import handleConfigFailure, { InvalidConfigHandler } from './app/handleInvalidConfig'
import { Either, fold, Right, right } from 'fp-ts/lib/Either'
import handleValidConfig, { ValidConfigHandler } from './app/handleValidConfig'
import { flow } from 'fp-ts/lib/function'
import logger from './logger'
import { Config } from './config/Config'

export type AppStopper = () => void;

/** If app was initiated, returns callback to stop it gracefully */
export type AppRunner = () => Promise<Either<AppStopper, null>>;

const logConfigFail = (err: Error): Error => logger.error('Configuration ERROR') && logger.error({ message: err }) && err;
const logConfigOk = (config: Config): Config => logger.info('Configuration OK') && config;

const emptyResult = () => Promise.resolve(right(null));

const startOrFail = (handleValidConfig: ValidConfigHandler, handleInvalidConfig: InvalidConfigHandler) => 
  fold(
    flow(logConfigFail, handleInvalidConfig, emptyResult),
    flow(logConfigOk, handleValidConfig),
  );

export const base = 
  (loadConfig: ConfigLoader, handleValidConfig: ValidConfigHandler, handleInvalidConfig: InvalidConfigHandler): AppRunner => 
  () => loadConfig().then(startOrFail(handleValidConfig, handleInvalidConfig));

export default base(loadConfig, handleValidConfig, handleConfigFailure)

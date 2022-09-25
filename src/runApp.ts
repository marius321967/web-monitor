import loadConfig, { ConfigLoader } from './loadConfig'
import handleConfigFailure, { ConfigFailureHandler } from './config/handleConfigFailure'
import { fold } from 'fp-ts/lib/Either'
import handleValidConfig, { ValidConfigHandler } from './app/handleValidConfig'

export type AppRunner = () => Promise<void>;

const startOrFail = (handleValidConfig: ValidConfigHandler, handleInvalidConfig: ConfigFailureHandler) => 
  fold(
    handleInvalidConfig,
    handleValidConfig
  );

export const base = 
  (loadConfig: ConfigLoader, handleValidConfig: ValidConfigHandler, handleInvalidConfig: ConfigFailureHandler): AppRunner => 
  () => loadConfig().then(startOrFail(handleValidConfig, handleInvalidConfig));

export default base(loadConfig, handleValidConfig, handleConfigFailure)

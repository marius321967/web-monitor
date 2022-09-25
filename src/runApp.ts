import loadConfig, { ConfigLoader } from './loadConfig'
import handleConfigFailure, { InvalidConfigHandler } from './app/handleInvalidConfig'
import { fold } from 'fp-ts/lib/Either'
import handleValidConfig, { ValidConfigHandler } from './app/handleValidConfig'

export type AppRunner = () => Promise<void>;

const startOrFail = (handleValidConfig: ValidConfigHandler, handleInvalidConfig: InvalidConfigHandler) => 
  fold(
    handleInvalidConfig,
    handleValidConfig
  );

export const base = 
  (loadConfig: ConfigLoader, handleValidConfig: ValidConfigHandler, handleInvalidConfig: InvalidConfigHandler): AppRunner => 
  () => loadConfig().then(startOrFail(handleValidConfig, handleInvalidConfig));

export default base(loadConfig, handleValidConfig, handleConfigFailure)

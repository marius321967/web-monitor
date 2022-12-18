import { Either, isRight, Right } from 'fp-ts/lib/Either'
import logger from '../logger'
import pullConfigEnv, { ConfigEnvPuller } from './pullConfigEnv'
import pullConfigFile, { ConfigFilePuller } from './pullConfigFile'

export type ConfigPuller = () => Promise<Either<Error, string>>

const envFound = (result: Right<string>) => {
  logger.debug('Found config in environment variable');
  return Promise.resolve(result);
}

export const base = 
  (pullConfigEnv: ConfigEnvPuller, pullConfigFile: ConfigFilePuller): ConfigPuller =>
  () => {
    const envResult = pullConfigEnv();

    return (isRight(envResult))
      ? envFound(envResult)
      : pullConfigFile();
  }

/** Searches for config text in all available sources */
export default base(pullConfigEnv, pullConfigFile)

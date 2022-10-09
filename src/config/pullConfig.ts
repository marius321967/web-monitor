import { Either, isRight } from 'fp-ts/lib/Either'
import pullConfigEnv, { ConfigEnvPuller } from './pullConfigEnv'
import pullConfigFile, { ConfigFilePuller } from './pullConfigFile'

export type ConfigPuller = () => Promise<Either<Error, string>>

export const base = 
  (pullConfigEnv: ConfigEnvPuller, pullConfigFile: ConfigFilePuller): ConfigPuller =>
  () => {
    const envResult = pullConfigEnv();

    return (isRight(envResult))
      ? Promise.resolve(envResult)
      : pullConfigFile();
  }

/** Searches for config text in all available sources */
export default base(pullConfigEnv, pullConfigFile)

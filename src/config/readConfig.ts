import { Either, fold, left } from 'fp-ts/Either'
import parseYaml, { ConfigFileParser } from './parseYaml'
import pullConfig, { ConfigPuller } from './pullConfig'

export type ConfigReader = () => Promise<Either<Error, any>>

export const base = 
  (pullConfig: ConfigPuller, parse: ConfigFileParser): ConfigReader => 
  () => pullConfig()
    .then(fold(
      (err) => left(err),
      parse
    ))

/** Reads & parses config from source, validating its syntax but not structure */
export default base(pullConfig, parseYaml)

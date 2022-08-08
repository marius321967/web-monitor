import { Either, left, right, fold } from 'fp-ts/Either'
import { fold as foldOpt } from 'fp-ts/Option'
import { Config } from './config/Config'
import { ConfigReader } from './config/readConfig'
import { ConfigValidator } from './config/validateConfig'

/**
 * Reads and validates configuration. 
 * Results in error if config is missing or invalid
 */
export type ConfigLoader = () => Promise<Either<Error, Config>>

const doValidate = (validate: ConfigValidator) => (config: any): Promise<Either<Error, Config>> => validate(config)
  .then(err => (err !== null)
    ? left(err)
    : right(config)
  )

export const base = (read: ConfigReader, validate: ConfigValidator): ConfigLoader =>
  () => read()
    .then(fold(
      err => Promise.resolve(left(err)),
      doValidate(validate)
    ))

export default (() => {}) as ConfigLoader;

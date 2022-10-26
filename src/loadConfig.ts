import { Either, left, right, fold } from 'fp-ts/Either'
import { Config } from './config/Config'
import readConfig, { ConfigReader } from './config/readConfig'
import { ConfigValidator } from './config/ConfigValidator'
import validateConfig from './config/validateConfig'
import logger from './logger'
import { flow, pipe } from 'fp-ts/lib/function'

/**
 * Reads and validates configuration. 
 * Results in error if config is missing or invalid
 */
export type ConfigLoader = () => Promise<Either<Error, Config>>

const log = () => logger.info('Loading & validating configuration...');

const doValidate = (validate: ConfigValidator) => (config: any): Promise<Either<Error, Config>> => validate(config)
  .then(err => (err !== null)
    ? left(err)
    : right(config)
  )

export const base = (read: ConfigReader, validate: ConfigValidator): ConfigLoader =>
  () => pipe(log(), read)
    .then(fold(
      err => Promise.resolve(left(err)),
      doValidate(validate)
    ))

export default base(readConfig, validateConfig)

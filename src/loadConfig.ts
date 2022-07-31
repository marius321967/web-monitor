import type { Either } from 'fp-ts/Either'
import { Config } from './config/Config'
import { ConfigReader } from './config/readConfig'
import { ConfigValidator } from './config/validateConfig'

/**
 * Reads and validates configuration. 
 * Results in error if config is missing or invalid
 */
export type ConfigLoader = () => Promise<Either<Error, Config>>

// todo
export const base = (read: ConfigReader, validate: ConfigValidator): ConfigLoader =>
    () => Promise.resolve({ error: new Error('') }) as any;

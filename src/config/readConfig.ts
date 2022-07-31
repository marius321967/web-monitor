import type { Either } from 'fp-ts/Either'
import type { ConfigFileParser } from './parseYaml'
import type { ConfigFileReader } from './readFile'

/** Reads config, validating its syntax but not structure */
export type ConfigReader = () => Promise<Either<Error, any>>

// todo
export const base = 
    (readFile: ConfigFileReader, parse: ConfigFileParser): ConfigReader => 
    () => Promise.resolve('') as any;
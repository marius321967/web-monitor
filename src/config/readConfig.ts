import { Either, fold, left } from 'fp-ts/Either'
import parseYaml, { ConfigFileParser } from './parseYaml'
import readFile, { ConfigFileReader } from './readFile'

/** Reads & parses config from source, validating its syntax but not structure */
export type ConfigReader = () => Promise<Either<Error, any>>

export const base = 
  (readFile: ConfigFileReader, parse: ConfigFileParser): ConfigReader => 
  () => readFile()
    .then(fold(
      (err) => left(err),
      parse
    ))

// export default base(readFile, parseYaml)

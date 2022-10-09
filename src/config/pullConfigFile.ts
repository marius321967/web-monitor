import { Either, left, right } from 'fp-ts/Either'
import { readFile as readFileFs } from 'fs/promises'

export type ConfigFilePuller = () => Promise<Either<Error, string>>

export type NativeFileReader = (filename: string) => Promise<Buffer>;

export const base =
    (readFileFs: NativeFileReader): ConfigFilePuller =>
    () => readFileFs('./config/config.yml')
        .then(buffer => right(buffer.toString()))
        .catch(left);

/** Reads file /config/config.yml */
export default base(readFileFs)

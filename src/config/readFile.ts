import { Either, left, right } from 'fp-ts/Either'
import { readFile as readFileFs } from 'fs/promises'

export type ConfigFileReader = () => Promise<Either<Error, string>>

export type NativeFileReader = (filename: string) => Promise<Buffer>;

export const base =
    (readFileFs: NativeFileReader): ConfigFileReader =>
    () => readFileFs('./config/config.yml')
        .then(buffer => right(buffer.toString()))
        .catch(left);

export default base(readFileFs)

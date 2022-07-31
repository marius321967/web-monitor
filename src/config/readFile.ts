import { Either, left } from 'fp-ts/Either'

export type ConfigFileReader = () => Promise<Either<Error, string>>

// todo
export const base =
    (): ConfigFileReader =>
    () => Promise.resolve(left('' as any))
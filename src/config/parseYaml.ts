import { Either } from 'fp-ts/Either'

export type ConfigFileParser = (data: string) => Either<Error, any>

// todo
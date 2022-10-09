import { Either, left, right } from 'fp-ts/lib/Either'

export type ConfigEnvPuller = () => Either<null, string>

const decode = (input: string): string => Buffer.from(input, 'base64').toString();

const attemptDecode = (input: string): Either<null, string> => {
  const result = decode(input as string);

  return result.length > 0
    ? right(result)
    : left(null);
}

export const base =
  (env: NodeJS.ProcessEnv): ConfigEnvPuller =>
  () => 
    ('CONFIG' in env)
      ? attemptDecode(env.CONFIG as string)
      : left(null);

/** Reads Base64-encoded config file contents from envvar CONFIG if present */
export default base(process.env)

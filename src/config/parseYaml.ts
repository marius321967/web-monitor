import { Either, left, right } from 'fp-ts/Either'
import { parse } from 'yaml'

export type ConfigFileParser = (data: string) => Either<Error, any>

export type YamlLibParser = (src: string) => any;

export const base = 
  (parseYamlLib: YamlLibParser): ConfigFileParser => 
  (data) => {
    try {
      return right(parseYamlLib(data));
    }
    catch (err) {
      return left(err);
    }
  };

export default base(parse)

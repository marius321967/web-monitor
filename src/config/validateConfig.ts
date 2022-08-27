import { ConfigError, ConfigValidator } from './ConfigValidator'
import validateConnections from './validateConnections'
import validateStructure, { ConfigStructureValidator } from './validateStructure'

const pathToStr = (path: (string|number)[]): string => path.join('.');
const structureError = (configError: ConfigError): Error => new Error(`${configError.message} [${pathToStr(configError.path)}]`);

export const base = 
  (validateStructure: ConfigStructureValidator, validateConnections: ConfigValidator): ConfigValidator =>
  (input) => {
    const result = validateStructure(input);

    if (result !== null)
      return Promise.resolve(structureError(result));

    return validateConnections(input);
  }

export default base(validateStructure, validateConnections)

import { ConfigValidator } from './ConfigValidator'
import { ConfigStructureValidator } from './validateStructure'

// todo
export const base = 
  (validateStructure: ConfigStructureValidator, validateConnections: ConfigValidator): ConfigValidator =>
  (input) => Promise.resolve(null);

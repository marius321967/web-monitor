import { ConfigValidator } from './ConfigValidator'

export type ConfigConnectionsValidator = ConfigValidator;

// todo
export const base = 
  (): ConfigConnectionsValidator =>
  () => Promise.resolve(null);

export default base()

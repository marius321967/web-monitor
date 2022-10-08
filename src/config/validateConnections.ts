import { Config } from './Config';
import { ConfigValidator } from './ConfigValidator'
import validateEmailConnection, { EmailConnectionValidator } from './validateEmailConnection'

export type ConfigConnectionsValidator = ConfigValidator;

export const base = 
  (validateEmailConnection: EmailConnectionValidator): ConfigConnectionsValidator =>
  (config: Config) => 
    validateEmailConnection(config.email_notifier);

export default base(validateEmailConnection)

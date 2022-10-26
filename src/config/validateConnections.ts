import { Config } from './Config'
import validateEmailConnection, { EmailConnectionValidator } from './validateEmailConnection'

export type ConfigConnectionsValidator = (config: Config) => Promise<Error | null>;

const prefixEmail = (err: Error): Error => {
  err.message = `Email error: ${err.message}`;
  return err;
};

export const base = 
  (validateEmailConnection: EmailConnectionValidator): ConfigConnectionsValidator =>
  (config) => 
    validateEmailConnection(config.email_notifier)
      .then(result => (result === null) ? result : prefixEmail(result))

export default base(validateEmailConnection)

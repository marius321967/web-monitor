import { Config } from './Config'
import { ConfigError } from './ConfigValidator'
import joi from 'joi'
import toConfigError from './joi/toConfigError'
import monitorsSchema from './structure/monitorsSchema'
import notifySchema from './structure/notifySchema'
import emailNotifierSchema from './structure/emailNotifierSchema'

/** 
 * Checks if input matches the structure of Config
 * @see Config
 */
export type ConfigStructureValidator = (input: any) => ConfigError | null;

const rules = joi.object<Config>({
  monitors: monitorsSchema,
  notify: notifySchema,
  email_notifier: emailNotifierSchema,
});

const validateStructure: ConfigStructureValidator = (input) => {
  const result = rules.validate(input, { abortEarly: true });

  return (result.error)
    ? toConfigError(result.error)
    : null;
};

export default validateStructure

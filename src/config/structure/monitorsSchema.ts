import joi, { CustomHelpers } from 'joi'
import { IntervalTimeUnitEnum, MonitorConfig, MonitorMap, MonitorRequestConfigComplex, MonitorType, RequestMethod } from '../Config'
import { amount } from '../timeAmount'
import { load as cheerioLoad } from 'cheerio'

const timeUnitList = Object.values(IntervalTimeUnitEnum);

const timeAmountSchema = joi.string()
  .pattern(new RegExp(`^(\\d+) (${timeUnitList.join('|')})$`))
  .custom((value, helper) => (amount(value) == 0)
    ? helper.error('string.time-amount.amount-not-positive')
    : value);

const requestUrlSchema = joi.string().uri().required();
const requestComplexSchema = joi.object<MonitorRequestConfigComplex>({
  url: requestUrlSchema,

  method: joi.string()
    .valid(...Object.values(RequestMethod))
    .messages({ 'any.only': 'string.http-method.base' }),

  auth_header: joi.string()
    .required(),
});

const requestSchema = joi.alternatives(
  requestUrlSchema,
  requestComplexSchema
).messages({ 'alternatives.types': 'monitor.request.base' });

const validateRegex = (input: string, helper: CustomHelpers) => {
  try {
    return new RegExp(input);
  }
  catch (err) {
    return helper.error('regexp.malformed');
  }
};

const elementPatternSchema = joi.custom((input: string, helper) => {
  const $ = cheerioLoad('<html></html>');

  try {
    $(input);
    return input;
  } catch (err) {
    return helper.error('string.element-match.pattern');
  }
});

const monitorSchema = joi.object<MonitorConfig>({
  label: joi.string()
    .required(),

  type: joi.string()
    .valid(...Object.values(MonitorType))
    .required(),

  interval: timeAmountSchema.required(),

  request: requestSchema.required(),

  expected_code: joi.number()
    .integer()
    .strict()
    .min(0)
    .when('type', { is: MonitorType.response_code, then: joi.required(), otherwise: joi.optional() }),

  threshold: joi.string()
    .when('type', { is: MonitorType.response_time, then: timeAmountSchema, otherwise: joi.optional() }),

  pattern: joi.string()
    .when('type', { is: MonitorType.content_match, then: joi.custom(validateRegex).message(''), otherwise: joi.optional() })
    .when('type', { is: MonitorType.element_match, then: elementPatternSchema, otherwise: joi.optional() }),
});

export default joi.object<MonitorMap>().pattern(
  /./,
  monitorSchema
).required()

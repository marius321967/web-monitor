import { ValidationError as JoiValidationError, ValidationErrorItem } from 'joi'
import { ConfigError } from '../ConfigValidator';
import staticTranslations from './staticTranslations'

/**
 * For codes which don't work with a simple translation table
 */
const dynamicCode = (item: ValidationErrorItem) => {
  switch (true) {
    case item.type == 'array.min' && item.context!.limit == 1:
      return 'EMPTY';
    case item.type == 'array.min' && item.context!.limit > 1:
      return 'MIN_AMOUNT_NOT_REACHED';
    default:
      return `UNKNOWN_ERROR:${item.type}`;
  }
}

const typeTranslation = (item: ValidationErrorItem): string | undefined => staticTranslations[item.type as keyof object];
const messageTranslation = (item: ValidationErrorItem): string | undefined => staticTranslations[item.message as keyof object];

const translateCode = (item: ValidationErrorItem): string => messageTranslation(item) || typeTranslation(item) || dynamicCode(item);

const firstItem = (error: JoiValidationError): ValidationErrorItem => error.details[0];

export default (error: JoiValidationError): ConfigError => ({ path: firstItem(error).path, message: translateCode(firstItem(error)) })

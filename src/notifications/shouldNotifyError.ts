import { isRecurringError, RecurringErrorChecker } from '@/monitors/statusRegistry'

export type ErrorNotificationFilter = (monitorId: string, error: Error) => Promise<boolean>

export const base = 
  (isRecurringError: RecurringErrorChecker): ErrorNotificationFilter =>
  (monitorId: string, error: Error) => 
    Promise.resolve(isRecurringError(monitorId, error));

/** Checks if error is repeating in sequence without being resolved */
export default base(isRecurringError)

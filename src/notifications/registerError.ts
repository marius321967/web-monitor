import { ErrorNotificationFilter } from './shouldNotifyError'
import { NotificationsSender } from './sendNotifications'

/** Registers monitor error. Decides whether to notify recipients. */
export type ErrorRegistration = (monitorId: string, error: Error) => Promise<void>

// todo
export const base = 
  (shouldNotifyError: ErrorNotificationFilter, sendNotifications: NotificationsSender): ErrorRegistration =>
  () => Promise.resolve();

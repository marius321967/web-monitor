import shouldNotifyError, { ErrorNotificationFilter } from './shouldNotifyError'
import sendNotifications, { NotificationsSender } from './sendNotifications'

/** Registers monitor error. Decides whether to notify recipients. */
export type ErrorRegistration = (monitorId: string, error: Error) => Promise<void>

export const base = 
  (shouldNotifyError: ErrorNotificationFilter, sendNotifications: NotificationsSender): ErrorRegistration =>
  (monitorId, error) => shouldNotifyError(monitorId, error)
    .then(should => (should)
      ? sendNotifications(error)
      : Promise.resolve()
    );

export default base(shouldNotifyError, sendNotifications)

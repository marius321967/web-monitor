import shouldNotifyError, { ErrorNotificationFilter } from './shouldNotifyError'
import sendNotifications, { NotificationsSender } from './sendNotifications'
import { UniqueMonitorConfig } from '@/config/Config';

export type ErrorRegistration = (uniqueConfig: UniqueMonitorConfig, error: Error) => Promise<void>

export const base = 
  (shouldNotifyError: ErrorNotificationFilter, sendNotifications: NotificationsSender): ErrorRegistration =>
  (uniqueConfig, error) => shouldNotifyError(uniqueConfig.id, error)
    .then(should => (should)
      ? sendNotifications(uniqueConfig, error)
      : Promise.resolve()
    );

/** 
 * Registers failure caught by monitor. 
 * Decides whether to notify recipients.
 * Must be called before state is updated.
 */
export default base(shouldNotifyError, sendNotifications)

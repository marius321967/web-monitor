import { MonitorType, UniqueMonitorConfig } from '@/config/Config'
import { ErrorRegistration as NotificationErrorRegistrator } from '@/notifications/registerError'
import { FailingCheckRegistrator as StatusFailingCheckRegistrator } from '../statusRegistry'
import notificationRegister from '@/notifications/registerError'
import { registerError } from '@/monitors/statusRegistry'

/** Handles cycle failure */
export type CycleFailureRegistrator = <T extends MonitorType>(uniqueConfig: UniqueMonitorConfig<T>, err: Error) => Promise<void>
// send notification & update status

export const base = 
  (notificationRegister: NotificationErrorRegistrator, updateStatus: StatusFailingCheckRegistrator): CycleFailureRegistrator => 
  (uniqueConfig, err) => 
    notificationRegister(uniqueConfig, err)
      .then(() => updateStatus(uniqueConfig.id, err));

/** Alerts notification service & updates monitor state */
export default base(notificationRegister, registerError)

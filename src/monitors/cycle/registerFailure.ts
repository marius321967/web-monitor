import { MonitorType, UniqueMonitorConfig } from '@/config/Config'
import { ErrorRegistration as NotificationErrorRegistrator } from '@/notifications/registerError'
import { FailingCheckRegistrator as StatusFailingCheckRegistrator } from '../statusRegistry'
import notificationRegister from '@/notifications/registerError'
import { registerError } from '@/monitors/statusRegistry'
import logger from '@/logger'
import { pipe } from 'fp-ts/lib/function'

/** Handles cycle failure */
export type CycleFailureRegistrator = <T extends MonitorType>(uniqueConfig: UniqueMonitorConfig<T>, err: Error) => Promise<void>

const log = (id: string, err: Error) => logger.info('Monitor cycle failure', { id, error: err.message });

export const base = 
  (notificationRegister: NotificationErrorRegistrator, updateStatus: StatusFailingCheckRegistrator): CycleFailureRegistrator => 
  (uniqueConfig, err) => 
    pipe(
      () => log(uniqueConfig.id, err),
      () => notificationRegister(uniqueConfig, err).then(() => updateStatus(uniqueConfig.id, err))
    );

/** Alerts notification service & updates monitor state */
export default base(notificationRegister, registerError)

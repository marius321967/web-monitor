import { UniqueMonitorConfig } from '@/config/Config'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'
import { ErrorRegistration } from '../notifications/registerError'

export type CycleCallback = () => Promise<void>
export type CycleCallbackBuilder = (uniqueConfig: UniqueMonitorConfig) => CycleCallback;

const registerErrorIfPresent = 
  (registerError: ErrorRegistration, monitorId: string) => 
  (result: Error | null): Promise<void> => 
    (result !== null)
      ? registerError(monitorId, result)
      : Promise.resolve();

// todo: notify errors
export const base =
  (monitorCheckerRegistry: MonitorCheckerMap, registerError: ErrorRegistration): CycleCallbackBuilder =>
  (uniqueConfig) => 
    () => monitorCheckerRegistry[config.type](config)
      .then(registerErrorIfPresent(registerError, uniqueConfig.id));

// export default base(monitorCheckerRegistry)

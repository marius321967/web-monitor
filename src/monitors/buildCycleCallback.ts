import { MonitorConfig } from '@/config/Config'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'
import { ErrorRegistration } from '../notifications/registerError'

export type CycleCallback = () => Promise<void>
export type CycleCallbackBuilder = (monitorId: string, config: MonitorConfig) => CycleCallback;

const registerErrorIfPresent = 
  (registerError: ErrorRegistration, monitorId: string) => 
  (result: Error | null): Promise<void> => 
    (result !== null)
      ? registerError(monitorId, result)
      : Promise.resolve();

// todo: notify errors
export const base =
  (monitorCheckerRegistry: MonitorCheckerMap, registerError: ErrorRegistration): CycleCallbackBuilder =>
  (monitorId, config) => 
    () => monitorCheckerRegistry[config.type](config)
      .then(registerErrorIfPresent(registerError, monitorId));

// export default base(monitorCheckerRegistry)

import { UniqueMonitorConfig } from '@/config/Config'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'
import registerError, { ErrorRegistration } from '../notifications/registerError'

export type CycleCallback = () => Promise<void>
export type CycleCallbackBuilder = (uniqueConfig: UniqueMonitorConfig) => CycleCallback;

const callChecker = 
  (registry: MonitorCheckerMap, uniqueConfig: UniqueMonitorConfig) => 
    registry[uniqueConfig.payload.type](uniqueConfig.payload);

const registerErrorIfPresent = 
  (registerError: ErrorRegistration, monitorId: string) => 
  (result: Error | null): Promise<void> => 
    (result !== null)
      ? registerError(monitorId, result)
      : Promise.resolve();

export const base =
  (monitorCheckerRegistry: MonitorCheckerMap, registerError: ErrorRegistration): CycleCallbackBuilder =>
  (uniqueConfig) => 
    () => callChecker(monitorCheckerRegistry, uniqueConfig)
      .then(registerErrorIfPresent(registerError, uniqueConfig.id));

export default base(monitorCheckerRegistry, registerError)

import { MonitorConfig } from '@/config/Config'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'
import { ErrorRegistration } from '../notifications/registerError'

export type CycleCallback = () => Promise<void>
export type CycleCallbackBuilder = (monitorId: string, config: MonitorConfig) => CycleCallback;

// todo: notify errors
export const base =
  (monitorCheckerRegistry: MonitorCheckerMap, registerError: ErrorRegistration): CycleCallbackBuilder =>
  (monitorId, config) => 
    () => monitorCheckerRegistry[config.type](config);

// export default base(monitorCheckerRegistry)

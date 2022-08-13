import { MonitorConfig } from '@/config/Config'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'

export type CycleCallback = () => void
export type CycleCallbackBuilder = (config: MonitorConfig) => CycleCallback;

export const base =
  (monitorCheckerRegistry: MonitorCheckerMap): CycleCallbackBuilder =>
  (config) => 
    () => monitorCheckerRegistry[config.type](config);

export default base(monitorCheckerRegistry)

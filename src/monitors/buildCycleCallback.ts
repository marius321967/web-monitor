import { UniqueMonitorConfig } from '@/config/Config'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'
import { CycleResultRegistrator } from './cycle/registerResult'

export type CycleCallback = () => Promise<void>
export type CycleCallbackBuilder = (uniqueConfig: UniqueMonitorConfig) => CycleCallback;

const callChecker = 
  (registry: MonitorCheckerMap, uniqueConfig: UniqueMonitorConfig) => 
    registry[uniqueConfig.payload.type](uniqueConfig.payload);

export const base =
  (monitorCheckerRegistry: MonitorCheckerMap, registerResult: CycleResultRegistrator): CycleCallbackBuilder =>
  (uniqueConfig) => 
    () => callChecker(monitorCheckerRegistry, uniqueConfig)
      .then(result => registerResult(uniqueConfig, result));

// export default base(monitorCheckerRegistry, registerResult)

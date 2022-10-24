import { UniqueMonitorConfig } from '@/config/Config'
import logger from '@/logger'
import { pipe } from 'fp-ts/lib/function'
import monitorCheckerRegistry, { MonitorCheckerMap } from './checkers'
import registerResult, { CycleResultRegistrator } from './cycle/registerResult'

export type CycleCallback = () => Promise<void>
export type CycleCallbackBuilder = (uniqueConfig: UniqueMonitorConfig) => CycleCallback;

const log = (id: string) => logger.debug(`Checking monitor [${id}]`);

const check = 
  (registry: MonitorCheckerMap, uniqueConfig: UniqueMonitorConfig) => 
    registry[uniqueConfig.payload.type](uniqueConfig.payload);

const checkAndRegister = 
  (registry: MonitorCheckerMap, registerResult: CycleResultRegistrator, uniqueConfig: UniqueMonitorConfig) =>
    check(registry, uniqueConfig)
      .then(result => registerResult(uniqueConfig, result));

export const base =
  (monitorCheckerRegistry: MonitorCheckerMap, registerResult: CycleResultRegistrator): CycleCallbackBuilder =>
  (uniqueConfig) => 
    () => pipe(
      () => log(uniqueConfig.id),
      () => checkAndRegister(monitorCheckerRegistry, registerResult, uniqueConfig)
    )

export default base(monitorCheckerRegistry, registerResult)

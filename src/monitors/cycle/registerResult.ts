import { MonitorType, UniqueMonitorConfig } from '@/config/Config'
import registerFailure, { CycleFailureRegistrator } from './registerFailure'
import registerSuccess, { CycleSuccessRegistrator } from './registerSuccess'

export type CycleResultRegistrator = <T extends MonitorType>(uniqueConfig: UniqueMonitorConfig<T>, result: Error | null) => Promise<void>

export const base = 
  (registerSuccess: CycleSuccessRegistrator, registerFailure: CycleFailureRegistrator): CycleResultRegistrator =>
  (uniqueConfig, result) => 
    (result === null)
      ? registerSuccess(uniqueConfig)
      : registerFailure(uniqueConfig, result);

export default base(registerSuccess, registerFailure)

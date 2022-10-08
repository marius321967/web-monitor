import { MonitorType, UniqueMonitorConfig } from '@/config/Config'
import { registerSuccess } from '../statusRegistry'

/** Handles cycle success */
export type CycleSuccessRegistrator = <T = MonitorType>(uniqueConfig: UniqueMonitorConfig<T>) => Promise<void>

export default (uniqueConfig) => registerSuccess(uniqueConfig.id)

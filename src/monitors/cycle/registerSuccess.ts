import { MonitorType, UniqueMonitorConfig } from '@/config/Config'
import { registerSuccess } from '../statusRegistry'

/** Handles cycle success */
export type CycleSuccessRegistrator = <T extends MonitorType>(uniqueConfig: UniqueMonitorConfig<T>) => Promise<void>

const fn: CycleSuccessRegistrator = (uniqueConfig) => {
  registerSuccess(uniqueConfig.id);

  return Promise.resolve();
};

export default fn

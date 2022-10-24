import { MonitorType, UniqueMonitorConfig } from '@/config/Config'
import logger from '@/logger'
import { registerSuccess } from '../statusRegistry'

/** Handles cycle success */
export type CycleSuccessRegistrator = <T extends MonitorType>(uniqueConfig: UniqueMonitorConfig<T>) => Promise<void>

const log = (id: string) => logger.debug('Monitor cycle success', { id });

const fn: CycleSuccessRegistrator = (uniqueConfig) => {
  log(uniqueConfig.id);

  registerSuccess(uniqueConfig.id);

  return Promise.resolve();
};

export default fn

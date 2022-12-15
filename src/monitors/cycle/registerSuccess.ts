import { MonitorType, UniqueMonitorConfig } from '@/config/Config'
import logger from '@/logger'
import { registerSuccess, SuccessfulCheckRegistrator } from '../statusRegistry'

/** Handles cycle success */
export type CycleSuccessRegistrator = <T extends MonitorType>(uniqueConfig: UniqueMonitorConfig<T>) => Promise<void>

const log = (id: string) => logger.debug('Monitor cycle success', { id });

export const base = 
  (updateStatus: SuccessfulCheckRegistrator): CycleSuccessRegistrator =>
  (uniqueConfig) => {
    log(uniqueConfig.id);

    updateStatus(uniqueConfig.id);

    return Promise.resolve();
  }

export default base(registerSuccess)

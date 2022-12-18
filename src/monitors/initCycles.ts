import { MonitorInterval } from '@/config/Config'
import logger from '../logger'
import { CycleCallback } from './buildCycleCallback'
import intervalToMs, { IntervalToMsConverter } from './IntervalToMs'
import { MonitorStopper } from './MonitorStopper'

export type CyclesInitiator = (callback: CycleCallback, interval: MonitorInterval) => MonitorStopper;
export type IntervalSetter = (callback: CycleCallback, timeout: number) => NodeJS.Timer;
export type IntervalClearer = (timer: NodeJS.Timer) => void;

export const base = 
  (setInterval: IntervalSetter, clearInterval: IntervalClearer, intervalToMs: IntervalToMsConverter): CyclesInitiator =>
  (callback, interval) => {
    const timer = setInterval(callback, intervalToMs(interval));
    const timerId = timer[Symbol.toPrimitive]();
    
    logger.debug('Started interval', { timerId });

    return () => {
      logger.debug('Clearing interval', { timerId });
      clearInterval(timer);
    }
  }

export default base(setInterval, clearInterval, intervalToMs)

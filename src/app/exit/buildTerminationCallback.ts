import logger from '@/logger'
import { MonitorStopper } from '@/monitors/MonitorStopper'

export type TerminationCallback = () => void
export type TerminationCallbackBuilder = (stoppers: MonitorStopper[]) => TerminationCallback

const fn: TerminationCallbackBuilder = 
  (stoppers) =>
  () => {
    logger.debug('Got process exit signal - closing');

    stoppers.map(stop => stop());
  }

export default fn

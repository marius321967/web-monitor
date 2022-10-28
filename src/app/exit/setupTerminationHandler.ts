import logger from '@/logger';
import { MonitorStopper } from '@/monitors/MonitorStopper'
import buildTerminationCallback, { TerminationCallbackBuilder } from './buildTerminationCallback'

export type TerminationHandlerSetup = (stoppers: MonitorStopper[]) => void;

export const base = 
  (nodeProcess: NodeJS.Process, buildTerminationCallback: TerminationCallbackBuilder): TerminationHandlerSetup =>
  (stoppers) => {
    nodeProcess.on('SIGINT', buildTerminationCallback(stoppers));

    logger.debug('Set up process termination handler');
  }

/** Stops all monitors on process exit event */
export default base(process, buildTerminationCallback);

import logger from '@/logger';
import { MonitorStopper } from '@/monitors/MonitorStopper'
import buildTerminationCallback, { TerminationCallbackBuilder } from './buildTerminationCallback'

export type TerminationHandler = () => void;

/**
 * Sets up SIGINT handler
 * Returns callback to stop background jobs
 */
export type TerminationHandlerSetup = (stoppers: MonitorStopper[]) => TerminationHandler;

export const base = 
  (nodeProcess: NodeJS.Process, buildTerminationCallback: TerminationCallbackBuilder): TerminationHandlerSetup =>
  (stoppers) => {
    const terminationCallback = buildTerminationCallback(stoppers);
    nodeProcess.on('SIGINT', terminationCallback);

    logger.debug('Set up process termination handler');

    return terminationCallback;
  }

/** Stops all monitors on process exit event */
export default base(process, buildTerminationCallback);

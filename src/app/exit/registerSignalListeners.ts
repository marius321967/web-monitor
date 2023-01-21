import { TerminationCallback } from './buildTerminationCallback'

/**
 * Hooks into Node's process.on() listener to activate termination callback
 */
export type SignalListenerRegistrator = (terminationCallback: TerminationCallback) => void;

export const base =
  (nodeProcess: NodeJS.Process): SignalListenerRegistrator =>
  (terminationCallback) => {
    nodeProcess.on('SIGINT', terminationCallback);
    nodeProcess.on('SIGTERM', terminationCallback);
  };

export default base(process)

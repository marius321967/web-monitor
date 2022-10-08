// Keeps track of most recent monitoring results

/** True if latest monitoring check was successful. Otherwise Error */
type MonitorState = Error | true
type MonitorStateMap = { [key: string]: MonitorState }

const states: MonitorStateMap = {};

export type SuccessfulCheckRegistrator = (monitorId: string) => void;
export const registerSuccess: SuccessfulCheckRegistrator = (monitorId) => states[monitorId] = true;

export type FailingCheckRegistrator = (monitorId: string, err: Error) => void;
export const registerError: FailingCheckRegistrator = (monitorId, err) => states[monitorId] = err;

const compareErrors = (err1: Error, err2: Error): boolean => err1.message == err2.message;

export type RecurringErrorChecker = (monitorId: string, err: Error) => boolean;
/** Checks whether the same error occurred in previous monitoring cycle. False if previous check was successful. */
export const isRecurringError: RecurringErrorChecker = (monitorId, err) => (states[monitorId] === true || states[monitorId] === undefined)
  ? false
  : compareErrors(states[monitorId] as Error, err);

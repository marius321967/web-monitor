import { MonitorConfig } from '../../config/Config'

/** Runs a configured check - resolves null if the target service is healthy */
export type MonitorChecker<T extends MonitorConfig> = (monitor: T) => Promise<Error | null>

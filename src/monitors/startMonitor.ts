import { UniqueMonitorConfig } from '../config/Config'
import buildCycleCallback, { CycleCallbackBuilder } from './buildCycleCallback'
import initCycles, { CyclesInitiator } from './initCycles'
import { MonitorStopper } from './MonitorStopper'

export type MonitorStarter = (uniqueConfig: UniqueMonitorConfig) => Promise<MonitorStopper>

export const base =
    (buildCycleCallback: CycleCallbackBuilder, initCycles: CyclesInitiator): MonitorStarter =>
    /** Finds correct monitor checker & initiates monitoring */
    (uniqueConfig) => {
        const callback = buildCycleCallback(uniqueConfig);

        callback();

        const monitorStopper = initCycles(callback, uniqueConfig.payload.interval);

        return Promise.resolve(monitorStopper);
    }

export default base(buildCycleCallback, initCycles)

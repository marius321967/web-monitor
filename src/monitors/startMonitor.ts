import { MonitorConfig } from '../config/Config'
import buildCycleCallback, { CycleCallbackBuilder } from './buildCycleCallback'
import initCycles, { CyclesInitiator } from './initCycles';
import { MonitorStopper } from './MonitorStopper'

export type MonitorStarter = (monitorConfig: MonitorConfig) => Promise<MonitorStopper>

export const base =
    (buildCycleCallback: CycleCallbackBuilder, initCycles: CyclesInitiator): MonitorStarter =>
    /** Finds correct monitor checker & initiates monitoring */
    (monitorConfig) => {
        const callback = buildCycleCallback(monitorConfig);

        callback();

        const monitorStopper = initCycles(callback, monitorConfig.interval);

        return Promise.resolve(monitorStopper);
    }

export default base(buildCycleCallback, initCycles)

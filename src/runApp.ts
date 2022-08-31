import loadConfig, { ConfigLoader } from './loadConfig'
import startMonitors, { MonitorsStarter } from './startMonitors'
import handleConfigFailure, { ConfigFailureHandler } from './config/handleConfigFailure'

const startOrFail = (successCallback, failureCallback): void => {};

export type AppRunner = () => Promise<void>;

// todo
export const base = 
  (loadConfig: ConfigLoader, startMonitors: MonitorsStarter, handleConfigFailure: ConfigFailureHandler): AppRunner => 
  () => Promise.resolve()
  // =>  loadConfig().then(startOrFail(startMonitors, handleConfigFailure));

export default base(loadConfig, startMonitors, handleConfigFailure)
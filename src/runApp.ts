import loadConfig, { ConfigLoader } from './loadConfig'
import startMonitors, { MonitorsStarter } from './startMonitors'
import handleConfigFailure, { ConfigFailureHandler } from './config/handleConfigFailure'
import { fold } from 'fp-ts/lib/Either';

export type AppRunner = () => Promise<void>;

const startOrFail = (successCallback: MonitorsStarter, failureCallback: ConfigFailureHandler) => 
  fold(
    failureCallback,
    successCallback
  );

export const base = 
  (loadConfig: ConfigLoader, startMonitors: MonitorsStarter, handleConfigFailure: ConfigFailureHandler): AppRunner => 
  () => loadConfig().then(startOrFail(startMonitors, handleConfigFailure));

export default base(loadConfig, startMonitors, handleConfigFailure)
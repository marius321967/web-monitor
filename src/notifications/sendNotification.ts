import { Recipient, UniqueMonitorConfig } from '../config/Config'

export type NotificationSender = (recipient: Recipient, uniqueMonitorConfig: UniqueMonitorConfig, error: Error) => Promise<void>

// todo
export const base = 
  (): NotificationSender =>
  () => Promise.resolve()

export default base()

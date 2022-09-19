import { Recipient, UniqueMonitorConfig } from '../config/Config'
import { NotificationAgentMap } from './agents'
import notificationAgentSender from './agents'

export type NotificationSender = (recipient: Recipient, context: NotificationContext) => Promise<void>

export type NotificationContext = { uniqueMonitorConfig: UniqueMonitorConfig, error: Error };

export const base = 
  (agentMap: NotificationAgentMap): NotificationSender =>
  (recipient, context) => agentMap.email(recipient.email, context);

export default base(notificationAgentSender)

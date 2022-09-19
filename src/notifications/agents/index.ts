import { NotificationContext } from '../sendNotification'
import email from './email'

export enum NotificationAgentType {
  email = 'email',
}

export type NotificationAgentSender = (recipient: string, context: NotificationContext) => Promise<void>

export type NotificationAgentMap = { [key in NotificationAgentType]: NotificationAgentSender }

const map: NotificationAgentMap = { email, };

export default map

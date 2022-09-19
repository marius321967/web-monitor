import { UniqueMonitorConfig } from '@/config/Config'
import { getRecipients, RecipientsGetter } from '@/config/container'
import { map } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { values } from 'ramda'
import sendNotification, { NotificationSender } from './sendNotification'

/** Sends error notifications to registred recipients */
export type NotificationsSender = (uniqueMonitorConfig: UniqueMonitorConfig, error: Error) => Promise<void>

export const base = 
  (getRecipients: RecipientsGetter, sendNotification: NotificationSender): NotificationsSender =>
  (uniqueMonitorConfig, error) => pipe(
    getRecipients(),
    values,
    map(recipient => sendNotification(recipient, { uniqueMonitorConfig, error })),
    jobs => Promise.all(jobs).then(() => undefined),
  )

export default base(getRecipients, sendNotification)

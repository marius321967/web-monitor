import logger from '@/logger'
import { NotificationAgentSender } from '.'
import getTransport, { TransportGetter } from './nodemailer/getTransport'

const log = (recipient: string): void => logger.debug('Sent email notification', { email: recipient }) && undefined;

export const base = 
  (getTransport: TransportGetter): NotificationAgentSender =>
  (recipient, context) => 
    getTransport()
      .sendMail({
      to: recipient,
      subject: `[${context.uniqueMonitorConfig.id}] Error caught by web-monitor`,
      text: `One of your web monitors caught an error:

      ID: ${context.uniqueMonitorConfig.id},
      Label: ${context.uniqueMonitorConfig.payload.label}
      Error: ${context.error.message}
      `,
    })
    .then(() => log(recipient));

export default base(getTransport)

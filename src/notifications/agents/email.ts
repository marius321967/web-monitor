import { NotificationAgentSender } from '.'
import getTransport, { TransportGetter } from './nodemailer/getTransport'

export const base = 
  (getTransport: TransportGetter): NotificationAgentSender =>
  (recipient, context) => getTransport().sendMail({
    to: recipient,
    subject: `[${context.uniqueMonitorConfig.id}] Error caught by web-monitor`,
    text: `One of your web monitors caught an error:

    ID: ${context.uniqueMonitorConfig.id},
    Label: ${context.uniqueMonitorConfig.payload.label}
    Error: ${context.error.message}
    `,
  })

export default base(getTransport)

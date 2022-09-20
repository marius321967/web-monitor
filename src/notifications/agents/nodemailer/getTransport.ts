import { getMailConfig, MailConfigGetter } from '@/config/container'
import { createTransport, Transporter } from 'nodemailer'

export type AgentGetter = () => Transporter;

let transport: Transporter|null = null;

export const base =
  (getMailConfig: MailConfigGetter) =>
  () => {
    if (!transport)
      transport = createTransport(getMailConfig());

    return transport;
  }

export default base(getMailConfig)

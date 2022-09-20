import { getMailConfig, MailConfigGetter } from '@/config/container'
import { createTransport, Transporter } from 'nodemailer'

export type TransportGetter = () => Transporter;

let transport: Transporter|null = null;

export const base =
  (getMailConfig: MailConfigGetter): TransportGetter =>
  () => {
    if (!transport)
      transport = createTransport(getMailConfig());

    return transport;
  }

export default base(getMailConfig)

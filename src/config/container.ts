import { Config, EmailNotifierConfig, RecipientMap } from './Config'

const container: { payload: Config|null } = { payload: null };

export type ConfigSetter = (config: Config) => void;
export type RecipientsGetter = () => RecipientMap;
export type MailConfigGetter = () => EmailNotifierConfig;

export const setConfig: ConfigSetter = (payload) => container.payload = payload;
export const getRecipients: RecipientsGetter = () => container.payload?.notify as RecipientMap;
export const getMailConfig: MailConfigGetter = () => container.payload?.email_notifier as EmailNotifierConfig;

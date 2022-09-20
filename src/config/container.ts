import { Config, EmailNotifierConfig, RecipientMap } from './Config'

const container: { payload: Config|null } = { payload: null };

// todo: use
export const setConfig = (payload: Config) => container.payload = payload;

export type RecipientsGetter = () => RecipientMap;
export type MailConfigGetter = () => EmailNotifierConfig;

export const getRecipients: RecipientsGetter = () => container.payload?.notify as RecipientMap;
export const getMailConfig: MailConfigGetter = () => container.payload?.email_notifier as EmailNotifierConfig;

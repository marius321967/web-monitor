import { Config, RecipientMap } from './Config'

const container: { payload: Config|null } = { payload: null };

// todo: use
export const setConfig = (payload: Config) => container.payload = payload;

export type RecipientsGetter = () => RecipientMap;
export const getRecipients: RecipientsGetter = (): RecipientMap => container.payload?.notify as RecipientMap;

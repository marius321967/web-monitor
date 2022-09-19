import { NotificationAgentSender } from '.'

// todo
export const base = 
  (): NotificationAgentSender =>
  () => Promise.resolve()

export default base()

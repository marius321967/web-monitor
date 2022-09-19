/** Checks if error is repeating in sequence without being resolved */
export type ErrorNotificationFilter = (monitorId: string, error: Error) => Promise<boolean>

export const base = 
  (): ErrorNotificationFilter =>
  (monitorId: string, error: Error) => Promise.resolve(true);

// todo
export default base()

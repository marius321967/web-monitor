/** Checks if error is repeating in sequence without being resolved */
export type ErrorNotificationFilter = (monitorId: string, error: Error) => Promise<boolean>

// todo

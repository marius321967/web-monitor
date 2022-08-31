/** Sends error notifications to registred recipients */
export type NotificationsSender = (error: Error) => Promise<void>

// todo

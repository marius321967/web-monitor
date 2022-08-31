import { MonitorConfig } from '../config/Config'

// todo refactor
export type NotificationSender = (config: MonitorConfig) => Promise<void>

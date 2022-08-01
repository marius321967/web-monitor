import { MonitorConfig } from '../config/Config'

export type NotificationSender = (config: MonitorConfig, meta: Object) => Promise<void>

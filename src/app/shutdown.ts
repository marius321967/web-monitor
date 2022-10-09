export type AppShutdown = () => void

const fn: AppShutdown = () => process.exit(1);

export default fn

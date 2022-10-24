import logger from '@/logger'

export type AppShutdown = () => void

const fn: AppShutdown = () => {
  logger.info('Shutting down');
  process.exit(1);
}

export default fn

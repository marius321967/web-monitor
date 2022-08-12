import shutdown, { AppShutdown } from '@/app/shutdown'
import logger from '@/logger'

export type ConfigFailureHandler = (error: Error) => void

export const base = 
    (shutdown: AppShutdown): ConfigFailureHandler => 
    /** Reports & shuts down the application  */
    (error) => {
        logger.error({ message: error });
        logger.info('Shutting down due to configuration error');

        shutdown();
    }

export default base(shutdown)

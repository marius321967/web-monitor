import shutdown, { AppShutdown } from '@/app/shutdown'
import logger from '@/logger'

export type InvalidConfigHandler = (error: Error) => void

export const base = 
    (shutdown: AppShutdown): InvalidConfigHandler => 
    /** Reports & shuts down the application  */
    (error) => {
        logger.info('Configuration invalid');
        logger.info('Shutting down due to configuration error');

        shutdown();
    }

export default base(shutdown)

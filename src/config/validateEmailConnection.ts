import { EmailNotifierConfig } from './Config'
import SMTPConnection from 'nodemailer/lib/smtp-connection'
import { clone } from 'ramda'
import logger from '@/logger'

export type EmailConnectionValidator = (config: EmailNotifierConfig) => Promise<Error | null>

const logSuccess = () => logger.debug('Email connection succeeded');
const logError = (err: Error) => logger.debug({ message: err });

const fn: EmailConnectionValidator =
  (config) => 
    new Promise<Error | null>(resolve => {
      logger.debug('Testing email connection...');

      const opts = clone(config);

      const c = new SMTPConnection({ ...opts, connectionTimeout: 5_000 });

      c.on('error', err => {
        c.close();
        logError(err);
        resolve(err);
      });

      c.connect(connError => {

        if (connError) {
          c.close();
          logError(connError);
          return resolve(connError);
        }

        c.login(opts.auth, authError => {
          c.close();

          if (authError) {
            logError(authError);
            return resolve(authError);
          }

          logSuccess();
          resolve(null);
        });

      });
  
      
    })
  

export default fn

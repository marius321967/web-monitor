import { EmailNotifierConfig } from './Config'
import SMTPConnection from 'nodemailer/lib/smtp-connection'
import { clone } from 'ramda';

export type EmailConnectionValidator = (config: EmailNotifierConfig) => Promise<Error | null>

const fn: EmailConnectionValidator =
  (config) => 
    new Promise<Error | null>(resolve => {
      const opts = clone(config);

      const c = new SMTPConnection({ ...opts, connectionTimeout: 5_000 });

      c.on('error', err => {
        c.close();
        resolve(err);
      });

      c.connect(connError => {

        if (connError) {
          c.close();
          return resolve(connError);
        }

        c.login(opts.auth, authError => {
          c.close();

          if (authError)
            return resolve(authError);

          resolve(null);
        });

      });
  
      
    })
  

export default fn

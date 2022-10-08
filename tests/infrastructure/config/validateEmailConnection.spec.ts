import { Config, EmailNotifierConfig } from '@/config/Config'
import readConfig from '@/config/readConfig'
import validateEmailConnection from '@/config/validateEmailConnection'
import { assert } from 'chai'
import { isLeft } from 'fp-ts/lib/Either'
import { clone } from 'ramda'

describe('config/validateEmailConnection', function() {
  
  this.timeout(10_000);

  let config: EmailNotifierConfig;

  const withHost = (host: string) => ({ ...config, host });
  const withPassword = (pass: string) => ({ ...config, auth: { ...config.auth, pass } });

  before(() => 
    readConfig()
      .then(r => isLeft(r)
        ? Promise.reject(r.left)
        : r.right as Config
      )
      .then(c => config = c.email_notifier)
  )

  it('Successful connection', () => 
    validateEmailConnection(config)
      .then(result => {
        assert.isNull(result, 'Expected a successful connection. Check your credentials. We recommend using a mailtrap.io account');
      })
  )

  it('Failing connection (unreachable host)', () => 
    validateEmailConnection( withHost('youtube.com') )
      .then(result => {
        assert.isNotNull(result);
      })
  )

  it('Failing connection (invalid credentials)', () => 
    validateEmailConnection( withPassword('an-incorrect-password') )
      .then(result => {
        assert.isNotNull(result);
      })
  )

})
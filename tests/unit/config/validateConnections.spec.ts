import { EmailConnectionValidator } from '@/config/validateEmailConnection'
import sinon from 'sinon'
import { base } from '@/config/validateConnections'
import { assert } from 'chai'
import { Config } from '@/config/Config'

describe('config/validateConnections', () => {

  let validateEmailConnection: EmailConnectionValidator;
  const config = Symbol() as unknown as Config;
  let emailError: Error;

  beforeEach(() => {
    validateEmailConnection = sinon.fake.resolves(null);
    emailError = new Error('FOO_ERR');
  })

  it(
    'Prefixes email error message by mutation',
    () => {
      const validateEmailConnection = sinon.fake.resolves(emailError);

      return base(validateEmailConnection)(config)
        .then(result => {
          assert.isNotNull(result);
          assert.equal(result?.message, 'Email error: FOO_ERR');
        })
    }
  )

  it(
      'Passes null', 
      () => base(validateEmailConnection)(config)
        .then(result => assert.isNull(result))
  )
  
})
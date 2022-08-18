import { ConfigReader } from '@/config/readConfig'
import { ConfigValidator } from '@/config/ConfigValidator'
import { assert } from 'chai'
import { left, right, fold } from 'fp-ts/Either'
import { base } from '@/loadConfig'
import sinon, { SinonSpy } from 'sinon'
import { Config } from '@/config/Config'

describe('loadConfig', () => {

  let read: ConfigReader, validate: ConfigValidator;

  const readWithError: () => ConfigReader = () => sinon.fake.resolves(left(new Error('CONFIG_READ_ERR')));
  const validateWithError: () => ConfigValidator = () => sinon.fake.resolves(new Error('VALIDATION_ERR'));

  beforeEach(() => {
    read = sinon.fake.resolves(right({ foo: 'bar' }));
    validate = sinon.fake.resolves(null);
  })

  it('Uses read()', () => 
    base(read, validate)()
      .then(() => sinon.assert.calledOnce(read as SinonSpy))
  )

  it('Uses validate()', () => 
    base(read, validate)()
      .then(() => sinon.assert.calledOnceWithExactly(validate as SinonSpy, { foo: 'bar' }))
  )

  it('Catches read() error', () => 
    base(readWithError(), validate)()
      .then(fold(
        ({ message }) => {
          assert.equal(message, 'CONFIG_READ_ERR');
          sinon.assert.notCalled(validate as SinonSpy);
        },
        () => assert.fail('Expected to return error')
      ))
  )

  it('Returns config if valid', 
    () => base(read, validate)()
      .then(fold(
        () => assert.fail('Expected successful result'),
        (config) => assert.deepEqual(config, { foo: 'bar' } as unknown as Config)
      ))
  )

  it(
    'Returns error if invalid', 
    () => base(read, validateWithError())()
      .then(fold(
        ({ message }) => assert.equal(message, 'VALIDATION_ERR'),
        () => assert.fail('Expected to return error'),
      ))
  )

})
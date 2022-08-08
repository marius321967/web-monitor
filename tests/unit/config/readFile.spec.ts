import { base, NativeFileReader } from '@/config/readFile'
import { assert } from 'chai';
import { fold } from 'fp-ts/Either'
import sinon, { SinonSpy } from 'sinon'

describe('config/readFile', () => {

  let readFileFs: NativeFileReader, readFileFsWithError: NativeFileReader;

  beforeEach(() => {
    readFileFs = sinon.fake.resolves(Buffer.from('foo bar'));
    readFileFsWithError = sinon.fake.rejects(new Error('FOO_ERR'));
  })

  it(
    'Reads static path from filesystem', 
    () => 
      base(readFileFs)()
        .then(() => sinon.assert.calledOnceWithExactly(readFileFs as SinonSpy, './config/config.yml'))
  )

  it(
    'Returns entire file as string', 
    () => 
      base(readFileFs)()
        .then(fold(
          err => assert.fail(err.message),
          contents => assert.equal(contents, 'foo bar')
        ))
  )

  it(
    'Catches in-promise errors from filesystem function',
    () => base(readFileFsWithError)()
      .then(fold(
        ({ message }) => assert.equal(message, 'FOO_ERR'),
        () => assert.fail('Expected to return error')
      ))
  )

})
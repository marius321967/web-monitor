import { ConfigFileParser } from '@/config/parseYaml'
import { ConfigFileReader } from '@/config/readFile'
import { fold, left, right } from 'fp-ts/Either'
import sinon, { SinonSpy } from 'sinon'
import { base } from '@/config/readConfig'
import { assert } from 'chai'

describe('config/readConfig', () => {

  let readFile: ConfigFileReader, readFileWithError: ConfigFileReader, 
    parse: ConfigFileParser, parseWithError: ConfigFileParser;

  beforeEach(() => {
    readFile =          sinon.fake.resolves(right('the file contents'));
    readFileWithError = sinon.fake.resolves(left(new Error('FOO_ERR')));

    parse =           sinon.fake.resolves(right({ the: 'file contents' }));
    parseWithError =  sinon.fake.resolves(left(new Error('BAR_ERR')));
  })

  it(
    'Uses readFile()',
    () => base(readFile, parse)()
      .then(() => sinon.assert.calledOnce(readFile as SinonSpy))
  )

  it(
    'Uses parse()',
    () => base(readFile, parse)()
      .then(() => sinon.assert.calledOnceWithExactly(parse as SinonSpy, 'the file contents'))
  )

  it(
    'Returns error from readFile()',
    () => base(readFileWithError, parse)()
      .then(fold(
        (err) => {
          assert.equal(err.message, 'FOO_ERR');
          sinon.assert.notCalled(parse as SinonSpy);
        },
        () => assert.fail('Expected to return error')
      ))
  )

  it(
    'Returns error from parse()',
    () => base(readFile, parseWithError)()
      .then(fold(
        (err) => assert.equal(err.message, 'BAR_ERR'),
        () => assert.fail('Expected to return error')
      ))
  )

  it(
    'Returns result from parse() when no error',
    () => base(readFile, parse)()
      .then(fold(
        err => assert.fail(err.message),
        contents => assert.deepEqual(contents, { the: 'file contents' })
      ))
  )

})
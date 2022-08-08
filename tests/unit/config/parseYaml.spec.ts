import { YamlLibParser } from '@/config/parseYaml'
import { base } from '@/config/parseYaml'
import { assert } from 'chai'
import { fold } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import sinon, { SinonSpy } from 'sinon'

describe('config/parseYaml', () => {

  let data: string, parseYamlLib: YamlLibParser, parseYamlLibWithError: YamlLibParser, result: Symbol;

  beforeEach(() => {
    data = 'foo bar';
    result = Symbol();
    parseYamlLib = sinon.fake.returns(result);
    parseYamlLibWithError = sinon.fake.throws(new Error('FOO_ERR'));
  })

  it(
    'Uses parseYamlLib()',
    () => {
      base(parseYamlLib)(data);

      sinon.assert.calledOnceWithExactly(parseYamlLib as SinonSpy, data);
    }
  )

  it(
    'Returns parsed YAML input',
    () => pipe(
      base(parseYamlLib)(data),
      fold(
        ({ message }) => assert.fail(message),
        actual => assert.equal(actual, result)
      )
    )
  )

  it(
    'Error if input has syntax errors',
    () => pipe(
      base(parseYamlLibWithError)(data),
      fold(
        ({ message }) => assert.equal(message, 'FOO_ERR'),
        () => assert.fail('Expected to return error')
      )
    )
  )

})

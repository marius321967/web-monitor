import { assert } from 'chai'
import { Either, fold, isLeft } from 'fp-ts/lib/Either'
import { Config } from '../../src/config/Config'
import { AppStopper } from '../../src/runApp'
import runApp from '../../src/runApp'
import sampleConfig from './sampleConfig'

describe('app', function() {

  this.timeout(10_000);

  let oldConfig;
  
  before(() => oldConfig = process.env.CONFIG)
  after(() => {
    if (oldConfig === undefined)
      delete process.env.CONFIG;
    else 
      process.env.CONFIG = oldConfig;
  })

  const setConfigEnv = (config: Config | null) => {
    if (config !== null) {
      const configJson = JSON.stringify(config);
      process.env.CONFIG = Buffer.from(configJson).toString('base64');
    } else {
      delete process.env.CONFIG;
    }
  }

  afterEach(() => setConfigEnv(null))

  // Close app if initiated
  let result: Either<AppStopper, null>;
  afterEach(() => {
    if (isLeft(result))
      result.left();
  })
  
  it('app exits gracefully when monitors list is empty', () => {
    setConfigEnv({ ...sampleConfig, monitors: {} });

    return runApp()
      .then(r => result = r)
      .then(fold(
        () => assert.fail('Expected app not to initiate'),
        () => {} // OK
      ));
  })
  
  it('app continues when monitors list is not empty', () => {
    setConfigEnv(sampleConfig);

    return runApp()
      .then(r => result = r)
      .then(fold(
        () => {},
        () => assert.fail('Expected app to initiate'),
      ))
  })
  
})

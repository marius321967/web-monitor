import { ConfigEnvPuller } from '@/config/pullConfigEnv'
import { ConfigFilePuller } from '@/config/pullConfigFile'
import { base } from '@/config/pullConfig'
import { isLeft, isRight, Left, left, Right, right } from 'fp-ts/lib/Either'
import sinon, { SinonSpy } from 'sinon'
import { assert } from 'chai'

describe('config/pullConfig', () => {

  let pullConfigEnv: ConfigEnvPuller, pullConfigFile: ConfigFilePuller;
  
  beforeEach(() => {
    pullConfigEnv = sinon.fake.returns( right('foo') )
    pullConfigFile = sinon.fake.resolves( right('bar') )
  })

  it('Returns envvar config', () => 
    base(pullConfigEnv, pullConfigFile)()
      .then(result => {
        sinon.assert.calledOnce(pullConfigEnv as SinonSpy);
        sinon.assert.notCalled(pullConfigFile as SinonSpy);

        assert.isTrue( isRight(result) );
        assert.equal((result as Right<string>).right, 'foo');
      })
  )

  it('Returns file config if envvar is empty', () => {
    pullConfigEnv = sinon.fake.returns( left(null) );

    return base(pullConfigEnv, pullConfigFile)()
      .then(result => {
        sinon.assert.calledOnce(pullConfigEnv as SinonSpy);
        sinon.assert.calledOnce(pullConfigFile as SinonSpy);

        assert.isTrue( isRight(result) );
        assert.equal((result as Right<string>).right, 'bar');
      })
  })

  it('Returns error from pullConfigFile() if both failed', () => {
    const error = new Error('FOO_ERR');
    pullConfigEnv = sinon.fake.returns( left(null) );
    pullConfigFile = sinon.fake.resolves( left(error) )
    
    return base(pullConfigEnv, pullConfigFile)()
      .then(result => {
        assert.isTrue( isLeft(result) );
        assert.equal((result as Left<Error>).left, error);
      })
  })

})

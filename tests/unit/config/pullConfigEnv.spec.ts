import { assert, expect } from 'chai'
import { base } from '@/config/pullConfigEnv'
import { isLeft, isRight, Right } from 'fp-ts/lib/Either';

describe('config/pullConfigEnv', () => {

  it('Returns Base64-decoded contents if present', () => {
    const pullConfigEnv = base({ CONFIG: 'Zm9vCmJhcg==' }); 
    const result = pullConfigEnv();

    assert.isTrue(isRight(result));
    assert.equal((result as Right<string>).right, 'foo\nbar');
  })

  it('Returns null if not present', () => {
    const pullConfigEnv = base({}); 
    const result = pullConfigEnv();

    assert.isTrue(isLeft(result));
  })

  it('Returns null if not Base64', () => {
    const pullConfigEnv = base({ CONFIG: '-' }); 
    const result = pullConfigEnv();

    assert.isTrue(isLeft(result));
  })

})

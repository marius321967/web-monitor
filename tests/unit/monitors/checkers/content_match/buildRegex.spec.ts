import buildRegex from '@/monitors/checkers/content_match/buildRegex'
import { expect } from 'chai';

describe('monitors/checkers/content_match/buildRegex', () => {

  it('Builds RegExp object (+ test)', () => {
    const pattern = '/^foo$/';
    const regex = buildRegex(pattern);

    expect(regex.test('foo')).to.be.true;
    expect(regex.test('/foo/')).to.be.false;
  })

})

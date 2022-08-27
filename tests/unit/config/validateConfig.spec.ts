import { base } from '@/config/validateConfig'
import { ConfigConnectionsValidator } from '@/config/validateConnections'
import { ConfigStructureValidator } from '@/config/validateStructure'
import { assert } from 'chai'
import sinon, { SinonSpy } from 'sinon'

describe('config/validateConfig', () => {

  const input = Symbol();
  let validateStructure: ConfigStructureValidator, validateConnections: ConfigConnectionsValidator;

  beforeEach(() => {
    validateStructure = sinon.fake.returns(null);
    validateConnections = sinon.fake.resolves(null);
  })

  it('Validates structure before connections', done => {
    base(validateStructure, validateConnections)(input)
      .then(() => {
        sinon.assert.calledOnceWithExactly(validateStructure as SinonSpy, input);
        sinon.assert.calledOnceWithExactly(validateConnections as SinonSpy, input);
        
        assert.isTrue((validateConnections as SinonSpy).calledAfter(validateStructure as SinonSpy), 'Call order incorrect');

        done();
      })
      .catch(done);
  })

  it('Cancels if structure is invalid', done => {
    validateStructure = sinon.fake.returns({ message: 'FOO_ERROR', path: ['foo', 0, 'bar'] });

    base(validateStructure, validateConnections)(input)
      .then(result => {
        sinon.assert.notCalled(validateConnections as SinonSpy);

        assert.isNotNull(result);
        assert.equal(result?.message, 'FOO_ERROR [foo.0.bar]');

        done();
      })
      .catch(done);
  })

  it('Cancels if connections are invalid', done => {
    const error = new Error('BAR_ERR');
    validateConnections = sinon.fake.resolves(error);

    base(validateStructure, validateConnections)(input)
      .then(result => {
        assert.isNotNull(result);
        assert.equal(result, error);

        done();
      })
      .catch(done);
  })
  

})

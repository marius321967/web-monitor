import { SuccessfulCheckRegistrator } from '@/monitors/statusRegistry'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../../sampleConfig'
import { base } from '@/monitors/cycle/registerSuccess'

describe('monitors/cycle/registerSuccess', () => {

  const uniqueConfig = { id: 'contact_form', payload: sampleConfig.monitors.contact_form };

  let updateStatus: SuccessfulCheckRegistrator;

  beforeEach(() => {
    updateStatus = sinon.fake();
  })

  it('Updates status of monitor', () => 
    base(updateStatus)(uniqueConfig)
      .then(() => {
        sinon.assert.calledOnceWithExactly(updateStatus as SinonSpy, 'contact_form');
      })
  )

})

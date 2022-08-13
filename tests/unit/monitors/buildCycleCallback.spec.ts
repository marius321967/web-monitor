import { base } from '@/monitors/buildCycleCallback'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../sampleConfig'
import { MonitorCheckerMap } from '@/monitors/checkers'
import { MonitorType } from '@/config/Config'

describe('monitors/buildCycleCallback', () => {

  const monitorCheckerMap: MonitorCheckerMap = {
    [MonitorType.ssl_validity]: sinon.fake.resolves(null),
    [MonitorType.content_match]: sinon.fake.resolves(null),
    [MonitorType.element_match]: sinon.fake.resolves(null),
    [MonitorType.response_code]: sinon.fake.resolves(null),
    [MonitorType.response_time]: sinon.fake.resolves(null),
  }

  const monitorConfig = sampleConfig.monitors.ssl;
  
  beforeEach(() => {
  })

  it(
    'Callback uses the appropriate checker',
    () => {
      const callback = base(monitorCheckerMap)(monitorConfig);
      
      callback();

      sinon.assert.calledOnceWithExactly(monitorCheckerMap.ssl_validity as SinonSpy, monitorConfig);
      sinon.assert.notCalled(monitorCheckerMap.response_code as SinonSpy);
      sinon.assert.notCalled(monitorCheckerMap.response_time as SinonSpy);
      sinon.assert.notCalled(monitorCheckerMap.content_match as SinonSpy);
      sinon.assert.notCalled(monitorCheckerMap.element_match as SinonSpy);
    }
  )

  it('Callback passes errors to handler')

})

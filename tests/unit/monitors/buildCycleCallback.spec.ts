import { base } from '@/monitors/buildCycleCallback'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../sampleConfig'
import { MonitorCheckerMap } from '@/monitors/checkers'
import { MonitorType } from '@/config/Config'
import { ErrorRegistration } from '@/notifications/registerError'

describe('monitors/buildCycleCallback', () => {
  
  const monitorId = 'foo';
  const sampleError = new Error('FOO_ERR');

  const monitorCheckerMap: MonitorCheckerMap = {
    [MonitorType.ssl_validity]: sinon.fake.resolves(null),
    [MonitorType.content_match]: sinon.fake.resolves(null),
    [MonitorType.element_match]: sinon.fake.resolves(null),
    [MonitorType.response_code]: sinon.fake.resolves(null),
    [MonitorType.response_time]: sinon.fake.resolves(sampleError),
  };

  let registerError: ErrorRegistration;
  
  beforeEach(() => {
    registerError = sinon.fake.resolves(undefined);
  })

  it(
    'Callback uses the appropriate checker',
    () => {
      const callback = base(monitorCheckerMap, registerError)(monitorId, sampleConfig.monitors.ssl);
      
      return callback()
        .then(() => {
          sinon.assert.calledOnceWithExactly(monitorCheckerMap.ssl_validity as SinonSpy, sampleConfig.monitors.ssl);
          sinon.assert.notCalled(monitorCheckerMap.response_code as SinonSpy);
          sinon.assert.notCalled(monitorCheckerMap.response_time as SinonSpy);
          sinon.assert.notCalled(monitorCheckerMap.content_match as SinonSpy);
          sinon.assert.notCalled(monitorCheckerMap.element_match as SinonSpy);
        })
    }
  )

  it('Callback registers errors', () => 
    base(monitorCheckerMap, registerError)(monitorId, sampleConfig.monitors.response_time)()
      .then(() => {
        sinon.assert.calledOnceWithExactly(registerError as SinonSpy, 'foo', sampleError);
      })
  )

  it('Callback error register not called when no error', () => 
    base(monitorCheckerMap, registerError)(monitorId, sampleConfig.monitors.ssl)()
      .then(() => {
        sinon.assert.notCalled(registerError as SinonSpy);
      })
  )

})

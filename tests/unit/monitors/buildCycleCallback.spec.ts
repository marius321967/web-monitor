import { base } from '@/monitors/buildCycleCallback'
import sinon, { SinonSpy } from 'sinon'
import sampleConfig from '../sampleConfig'
import { MonitorCheckerMap } from '@/monitors/checkers'
import { MonitorConfig, MonitorType, UniqueMonitorConfig } from '@/config/Config'
import { CycleResultRegistrator } from '@/monitors/cycle/registerResult'

describe('monitors/buildCycleCallback', () => {
  
  const withPayload = (payload: MonitorConfig): UniqueMonitorConfig => ({ id: 'foo', payload });
  
  const sampleError = new Error('FOO_ERR');

  const monitorCheckerMap: MonitorCheckerMap = {
    [MonitorType.ssl_validity]: sinon.fake.resolves(null),
    [MonitorType.content_match]: sinon.fake.resolves(null),
    [MonitorType.element_match]: sinon.fake.resolves(null),
    [MonitorType.response_code]: sinon.fake.resolves(null),
    [MonitorType.response_time]: sinon.fake.resolves(sampleError),
  };

  const successfulMonitor = withPayload(sampleConfig.monitors.ssl);
  const failingMonitor = withPayload(sampleConfig.monitors.response_time);

  let registerResult: CycleResultRegistrator;
  
  beforeEach(() => {
    registerResult = sinon.fake.resolves(undefined);
  })

  it(
    'Callback uses the appropriate checker',
    () => {
      const callback = base(monitorCheckerMap, registerResult)(withPayload(sampleConfig.monitors.ssl));
      
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

  it('Callback registers result (success)', () => 
    base(monitorCheckerMap, registerResult)(successfulMonitor)()
      .then(() => {
        sinon.assert.calledOnceWithExactly(registerResult as SinonSpy, successfulMonitor, null);
      })
  )

  it('Callback registers result (failure)', () => 
    base(monitorCheckerMap, registerResult)(failingMonitor)()
      .then(() => {
        sinon.assert.calledOnceWithExactly(registerResult as SinonSpy, failingMonitor, sampleError);
      })
  )

})

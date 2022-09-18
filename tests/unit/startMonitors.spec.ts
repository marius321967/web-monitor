import { MonitorStarter } from '@/monitors/startMonitor'
import sinon, { SinonSpy, SinonStub } from 'sinon'
import sampleConfig from './sampleConfig'
import { base } from '@/startMonitors'
import { assert } from 'chai'
import { MonitorStopper } from '@/monitors/MonitorStopper'

describe('startMonitors', () => {
  
  let startMonitor: MonitorStarter;
  const sampleMonitors = sampleConfig.monitors;
  const stoppers = [ Symbol(), Symbol(), Symbol() ];
  
  beforeEach(() => {
    startMonitor = sinon.stub();
    stoppers.forEach((stopper, index) => (startMonitor as SinonStub).onCall(index).returns(stopper));
  })
  
  it(
    'Uses startMonitor()', 
    () => base(startMonitor)(sampleConfig)
      .then(() => {
        sinon.assert.calledThrice(startMonitor as SinonSpy);
        
        assert.deepEqual((startMonitor as SinonSpy).getCall(0).args[0], { id: 'ssl', payload: sampleMonitors.ssl });
        assert.deepEqual((startMonitor as SinonSpy).getCall(1).args[0], { id: 'contact_form', payload: sampleMonitors.contact_form });
        assert.deepEqual((startMonitor as SinonSpy).getCall(2).args[0], { id: 'response_time', payload: sampleMonitors.response_time });
      })
  )
        
  it(
    'Returns list of MonitorStopper', 
    () => base(startMonitor)(sampleConfig)
      .then(result => assert.deepEqual(result, stoppers as unknown as MonitorStopper[]))
  )
  
})
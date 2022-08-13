import { MonitorStarter } from '@/monitors/startMonitor'
import sinon, { SinonSpy, SinonStub } from 'sinon'
import sampleConfig from './sampleConfig'
import { base } from '@/startMonitors'
import { assert } from 'chai'
import { MonitorStopper } from '@/monitors/MonitorStopper'

describe('startMonitors', () => {
  
  let startMonitor: MonitorStarter, config = sampleConfig;
  const stoppers = [ Symbol(), Symbol(), Symbol() ];
  
  beforeEach(() => {
    startMonitor = sinon.stub();
    stoppers.forEach((stopper, index) => (startMonitor as SinonStub).onCall(index).returns(stopper));
  })
  
  it(
    'Uses startMonitor()', 
    () => base(startMonitor)(config)
      .then(() => {
        sinon.assert.calledThrice(startMonitor as SinonSpy);
        
        Object.entries(config.monitors).forEach(
          ([ _, monitorConfig ], index) => 
          assert.deepEqual((startMonitor as SinonSpy).getCall(index).args[0], monitorConfig)
        );
      })
  )
        
  it(
    'Returns list of MonitorStopper', 
    () => base(startMonitor)(config)
      .then(result => assert.deepEqual(result, stoppers as unknown as MonitorStopper[]))
  )
  
})
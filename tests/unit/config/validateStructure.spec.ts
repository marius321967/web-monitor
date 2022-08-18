import { assert } from 'chai'
import validate from '@/config/validateStructure'
import { ConfigError, Path } from '@/config/ConfigValidator'
import sampleConfig from '../sampleConfig'
import { dissoc } from 'ramda'
import { MonitorRequestConfigComplex, MonitorType } from '@/config/Config'

const expect = (result: ConfigError | null) => 
  ({ 
    toGiveError: (expectedMessage: string, expectedPath: Path | void) => {
      assert.isNotNull(result, 'Expected to return error');

      if (expectedPath)
        assert.deepEqual(result?.path, expectedPath);
        
      assert.equal(result?.message, expectedMessage);
    }
  })

const withMonitor = (value: any): any => ({ ...sampleConfig, monitors: { test: value } });
const withMonitorRequest = (value: any): any => withMonitor({ ...sampleMonitor, request: value });

const sampleMonitor = sampleConfig.monitors.contact_form;
const malformedTimeAmount = '3 days 5';

const missingFieldMonitor = dissoc('request', sampleMonitor);
const extraFieldMonitor = { ...sampleMonitor, foo: 'bar' };
const nonStringLabelMonitor = { ...sampleMonitor, label: 123 };
const emptyLabelMonitor = { ...sampleMonitor, label: '' };
const unknownTypeMonitor = { ...sampleMonitor, type: 'foo_bar' };
const malformedIntervalMonitor = { ...sampleMonitor, interval: malformedTimeAmount };
const negativeIntervalMonitor = { ...sampleMonitor, interval: '-2 days' };
const zeroIntervalMonitor = { ...sampleMonitor, interval: '0 seconds' };
const unknownUnitIntervalMonitor = { ...sampleMonitor, interval: '2 dayx' };
const nonIntegerIntervalMonitor = { ...sampleMonitor, interval: '2.5 days' };
const invalidValueRquest = false;
const malformedUrlRequest = { ...(sampleMonitor.request as MonitorRequestConfigComplex), url: 'example.com/foo.txt' };
const unknownMethodRequest = { ...(sampleMonitor.request as MonitorRequestConfigComplex), method: 'FOO' };
const emptyAuthHeaderRequest = { ...(sampleMonitor.request as MonitorRequestConfigComplex), auth_header: '' };
const nonNumberCodeMonitor = { ...sampleMonitor, type: MonitorType.response_time, expected_code: '200' };
const negativeThresholdMonitor = { ...sampleMonitor, type: MonitorType.response_time, threshold: '-2 days' };
const malformedContentMatchMonitor = { ...sampleMonitor, type: MonitorType.content_match, pattern: '(' };
const malformedSelectorMonitor = { ...sampleMonitor, type: MonitorType.element_match, pattern: '..some-class' };


describe('config/validateStructure', () => {
  
  ['monitors', 'notify', 'email_notifier'].forEach(field => 
    it(`Rejects missing field: ${field}`)
  );
  
  it('Catches non-object [monitor.*]', () => expect(validate([])).toGiveError('NOT_OBJECT'))
  it('Catches missing fields [monitor.*]', () => expect(validate(withMonitor(missingFieldMonitor))).toGiveError('MISSING', ['monitors', 'test', 'request']))
  it('Catches unknown fields [monitor.*]', () => expect(validate(withMonitor(extraFieldMonitor))).toGiveError('INVALID_MODEL'))
  it('Catches non-string [monitor.*.label]', () => expect(validate(withMonitor(nonStringLabelMonitor))).toGiveError('NOT_STRING', ['monitors', 'test', 'label']))
  it('Catches empty [monitor.*.label]', () => expect(validate(withMonitor(emptyLabelMonitor))).toGiveError('EMPTY', ['monitors', 'test', 'label']))
  it('Catches unknown [monitor.*.type]', () => expect(validate(withMonitor(unknownTypeMonitor))).toGiveError('FORBIDDEN_VALUE', ['monitors', 'test', 'type']))
  it('Catches malformed [monitor.*.interval]', () => expect(validate(withMonitor(malformedIntervalMonitor))).toGiveError('INVALID_FORMAT', ['monitors', 'test', 'interval']))
  it('Catches negative amount [monitor.*.interval]', () => expect(validate(withMonitor(negativeIntervalMonitor))).toGiveError('INVALID_FORMAT', ['monitors', 'test', 'interval']))
  it('Catches amount=0 [monitor.*.interval]', () => expect(validate(withMonitor(zeroIntervalMonitor))).toGiveError('AMOUNT_NOT_POSITIVE', ['monitors', 'test', 'interval']))
  it('Catches non-integer amount [monitor.*.interval]', () => expect(validate(withMonitor(nonIntegerIntervalMonitor))).toGiveError('INVALID_FORMAT', ['monitors', 'test', 'interval']))
  it('Catches unknown time unit [monitor.*.interval]', () => expect(validate(withMonitor(unknownUnitIntervalMonitor))).toGiveError('INVALID_FORMAT', ['monitors', 'test', 'interval']))
  it('Catches non-object non-string [monitor.*.request]', () => expect(validate(withMonitorRequest(invalidValueRquest))).toGiveError('NOT_OBJECT_OR_STRING', ['monitors', 'test', 'request']))
  it('Catches malformed request [monitor.*.request.url]', () => expect(validate(withMonitorRequest(malformedUrlRequest))).toGiveError('INVALID_URL', ['monitors', 'test', 'request', 'url']))
  it('Catches unknown method [monitor.*.request.method]', () => expect(validate(withMonitorRequest(unknownMethodRequest))).toGiveError('UNKNOWN_METHOD', ['monitors', 'test', 'request', 'method']))
  it('Catches empty [monitor.*.request.auth_header]', () => expect(validate(withMonitorRequest(emptyAuthHeaderRequest))).toGiveError('EMPTY', ['monitors', 'test', 'request', 'auth_header']))
  it('Catches non-number [monitor.*.expected_code] (type=response_code)', () => expect(validate(withMonitor(nonNumberCodeMonitor))).toGiveError('NOT_NUMBER', ['monitors', 'test', 'expected_code']))
  it('Catches malformed [monitor.*.threshold] (type=response_time)', () => expect(validate(withMonitor(negativeThresholdMonitor))).toGiveError('INVALID_FORMAT', ['monitors', 'test', 'threshold']))
  // it('Catches negative amount [monitor.*.threshold]')
  // it('Catches amount=0 [monitor.*.threshold]')
  // it('Catches unknown time unit [monitor.*.threshold]')
  // it('Catches non-integer amount [monitor.*.threshold]')
  it('Catches malformed regex [monitor.*.pattern] (type=content_match)', () => expect(validate(withMonitor(malformedContentMatchMonitor))).toGiveError('MALFORMED_REGEX', ['monitors', 'test', 'pattern']))
  it('Catches malformed selector [monitor.*.pattern] (type=element_match)', () => expect(validate(withMonitor(malformedSelectorMonitor))).toGiveError('MALFORMED_SELECTOR', ['monitors', 'test', 'pattern']))
  
  it('Catches non-object [notify]')
  it('Catches missing fields [notify.*]')
  it('Catches unknown fields [notify.*]')
  it('Catches malformed email [notify.*.email]')
  
  it('Catches non-object [email_notifier]')
  it('Catches missing fields [email_notifier.*]')
  it('Catches unknown fields [email_notifier.*]')
  it('Catches malformed host [email_notifier.*.host]')
  it('Catches non-integer [email_notifier.*.port]')
  it('Catches non-object [email_notifier.*.auth]')
  it('Catches missing fields [email_notifier.*.auth]')
  it('Catches unknown fields [email_notifier.*.auth]')
  it('Catches non-string [email_notifier.*.auth.user]')
  it('Catches empty [email_notifier.*.auth.user]')
  it('Catches non-string [email_notifier.*.auth.pass]')
  it('Catches empty [email_notifier.*.auth.pass]')
  
})

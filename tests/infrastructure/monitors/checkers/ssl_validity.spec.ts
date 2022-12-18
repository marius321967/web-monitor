import { MonitorType, SslMonitor } from '@/config/Config'
import check from '@/monitors/checkers/ssl_validity'
import { assert } from 'chai'

describe('monitors/checkers/ssl_validity', function() {

  this.timeout(10_000);

  const monitor: SslMonitor = {
    label: 'Foo',
    type: MonitorType.ssl_validity,
    interval: '1 day',
    request: '',
  };

  const urls = [
    ['https://expired.badssl.com/', 'expired'],
    ['https://wrong.host.badssl.com/', 'wrong host'],
    ['https://self-signed.badssl.com/', 'self-signed'],
    ['https://untrusted-root.badssl.com/', 'untrusted root'],
    // ['https://revoked.badssl.com/', 'revoked cert'],
    // ['https://pinning-test.badssl.com/', 'pubkey pinning'],
  ];

  urls.forEach(([url, issue]) => 
    it(`Reports - ${issue}`, () => 
      check({ ...monitor, request: url })
        .then(result => {
          assert.isNotNull(result);
        })
    )
  )

  it('Passes valid cert', () => 
    check({ ...monitor, request: 'https://badssl.com' })
      .then(result => {
        assert.isNull(result);
      })
  )

})

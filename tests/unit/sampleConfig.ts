import { Config, MonitorType, RequestMethod } from '@/config/Config'

const sampleConfig: Config = ({
  monitors: {
    ssl: {
      label: 'SSL',
      type: MonitorType.ssl_validity,
      interval: '3 days',
      request: 'https://example.com',
    },
    contact_form: {
      label: 'Contact form functionality',
      type: MonitorType.response_code,
      interval: '1 week',
      request: {
        url: 'https://example.com/form_submit',
        method: RequestMethod.POST,
        auth_header: 'Basic Zm9vOmJhcg=='
      },
      expected_code: 200
    },
    response_time: {
      label: 'Contact form response time',
      type: MonitorType.response_time,
      interval: '2 days',
      request: 'https://example.com/products',
      threshold: '20 seconds'
    }
  },

  notify: {},

  email_notifier: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'foo',
      pass: 'bar'
    },
  }
})

export default sampleConfig
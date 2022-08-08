import { Config } from '@/config/Config'

const sampleConfig: Config = ({
  monitors: {},
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
import { Config, MonitorType, RequestMethod } from "@/config/Config";

const sampleConfig: Config = {
  monitors: {
    ssl: {
      label: "SSL",
      type: MonitorType.ssl_validity,
      interval: "3 days",
      request: "https://example.com",
    },
    contact_form: {
      label: "Contact form functionality",
      type: MonitorType.response_code,
      interval: "1 week",
      request: {
        url: "https://example.com/form_submit",
        method: RequestMethod.POST,
        auth_header: "Basic Zm9vOmJhcg==",
      },
      expected_code: 200,
    },
    response_time: {
      label: "Contact form response time",
      type: MonitorType.response_time,
      interval: "2 days",
      request: "https://example.com/products",
      threshold: "20 seconds",
    },
  },

  notify: {
    admin: {
      email: "admin@example.com",
    },
    developer_1: {
      email: "johndoe@example.com",
    },
  },

  email_notifier: {
    host: "sandbox.smtp.mailtrap.io",
    port: 465,
    secure: false,
    auth: {
      user: "foo",
      pass: "bar",
    },
  },
} as const;

export default sampleConfig;

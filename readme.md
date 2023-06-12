# web-monitor

[![Latest version](https://shields.io/github/v/release/marius321967/web-monitor?display_name=tag&sort=semver)](https://hub.docker.com/r/marius321967/web-monitor/tags)
[![CI/CD status](https://github.com/marius321967/web-monitor/workflows/CI/CD/badge.svg)](https://github.com/marius321967/web-monitor/actions/workflows/docker-image.yml)
![Test coverage](https://shields.io/nycrc/marius321967/web-monitor?config=.nycrc.json)
[![Licence](https://shields.io/github/license/marius321967/web-monitor)](/LICENSE)

Docker-based microservice monitors configured metrics and notifies administrators when they fail.

- metrics:
  - SSL validity (revocation & pubkey pinning not checked)
  - response code
  - response time
  - response content match (Regex)
  - HTML element availability (via selector)
- notifications:
  - email

## Deployment

Requirements:

- Docker

Steps:

- `docker pull marius321967/web-monitor`
- Configure Container or Compose:
  - Volumes: `/app/config` and `/app/logs`
  - Environment: `LOG_LEVEL=error/warn/info/http/verbose/debug`
- Edit `/config/config.yml` (see below)
- Run the Image

## config.yml

web-monitor requires you to set up:

- endpoints to monitor (`monitors`)
- people to notify (`notify`)
- credentials for notification services (`email_notifier`)

```yml
monitors:
  <monitor-id>:
    label: human readable name
    type: ssl_validity|response_code|response_time|content_match|element_match
    interval: <integer> seconds|minutes|hours|days|weeks
    request: https://example.com

    # string value will initiate a GET request. For more configurable requests, provide an object:
    request:
      url: https://example.com/form_submit
      method: GET|POST|DELETE|HEAD|OPTIONS|PUT|PATCH
      # (auth_header is optional)
      auth_header: Basic Zm9vOmJhcg==

    # some monitors require additional parameters
    type: response_code
    expected_code: 200

    # response_time monitor will send a notification if response takes longer than threshold
    type: response_time
    threshold: 20 seconds

    type: content_match
    pattern: mailto:john@example.com
    # pattern supports regex if surrounded by forward slashes. Flags after slashes are not supported.
    # see Node's support for RegEx:
    # https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#browser_compatibility
    pattern: /mailto:\w+@example.com/

    type: element_match
    # pattern supports CSS-style selectors provided by cheerio (https://cheerio.js.org/)
    pattern: body .contact-form

# notification recipients are listed as such
notify:
  <recipient-id>:
    # (web-monitor currently only notifies by email)
    email: admin@example.com
  <recipient-id>:
    email: johndoe@example.com

# finally, the mail server is set up
email_notifier:
  host: sandbox.smtp.mailtrap.io
  port: 465
  secure: false
  auth:
    user: foo
    pass: bar
```

Also see [config/config.example.yml](/config/config.example.yml)

## Development

Spin up a dev environment with Docker:

```bash
export COMPOSE_FILE=docker-compose.dev.yml

docker-compose up -d dev
```

Then edit from the host machine or by connecting to the _dev_ container from VS Code via [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

## Testing

Unit test: `yarn test:unit`

Integration test: `yarn test:integration`

Infrastructure test:

```bash
export COMPOSE_FILE=docker-compose.dev.yml

docker-compose up \
  --abort-on-container-exit \
  --exit-code-from=infra-test \
  infra-test
```

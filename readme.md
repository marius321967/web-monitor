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
- endpoints to monitor
- people to notify
- credentials for notification services

```yml
monitors:
  <monitor-id>:
    label: human readable name
    type: ssl_validity|response_code|response_time|content_match|element_match
    interval: <integer> seconds|minutes|hours|days|weeks
    request: https://example.com
```

`request` with a string value will initiate a GET request. For more configurable requests, provide an object:

```yml
    request:
      url: https://example.com/form_submit
      method: GET|POST|DELETE|HEAD|OPTIONS|PUT|PATCH
      auth_header: Basic Zm9vOmJhcg==
```

*`auth_header` is optional.*

Some monitors require additional parameters:
```yml
    type: response_code
    expected_code: 200
```

```yml
    type: response_time
    threshold: 20 seconds
```

*`response_time` monitor will send a notification if response takes longer than `threshold`.*

```yml
    type: content_match
    pattern: mailto:john@example.com
    pattern: /mailto:\w+@example.com/
```

*`pattern` supports regex if surrounded by forward slashes (see Node's support for [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#browser_compatibility)). Flags after slashes are not supported.*

```yml
    type: element_match
    pattern: body .contact-form
```

*`pattern` supports CSS-style selectors (provided by [cheerio](https://cheerio.js.org/)).*

Notification recipients are listed as such:

```yml
notify:
  <recipient-id>:
    email: admin@example.com
  <recipient-id>:
    email: johndoe@example.com
```

web-monitor currently only notifies by email.

Finally, the mail server is set up:

```yml
email_notifier:
  host: smtp.mailtrap.io
  port: 2525
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
Docker-based microservice monitors configured metrics and notifies administrators when they fail.

- metrics:
    - SSL validity
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
  - Ports: `8080`
- Edit `/config/config.yml`
- Run the Image

## Development
Spin up a dev environment with Docker:

```bash
export COMPOSE_FILE=docker-compose.dev.yml

docker-compose up -d dev
```

Then edit from the host machine or by connecting to the _dev_ container from VS Code via [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

## Testing

Unit test:
`yarn test:unit`

Infrastructure test:

```bash
export COMPOSE_FILE=docker-compose.dev.yml

docker-compose up \
  --abort-on-container-exit \
  --exit-code-from=infra-test \
  infra-test
```
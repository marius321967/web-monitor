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

## Testing

Unit test:
...

Infrastructure test:
...

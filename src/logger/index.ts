import { createLogger, format, transport, transports } from 'winston'

const selectedTransports: transport[] = [
  new transports.Console({
    format: format.combine(
      format.errors({ stack: true }),
      format.timestamp(),
      format.colorize(),
      format.simple()
    )
  })
]

if (process.env.NODE_ENV != 'test') 
  selectedTransports.push( 
    new transports.File({ 
      filename: './logs/web-monitor.log',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
      ),
    }) );

export default createLogger({
  level: 'info',
  transports: selectedTransports
})

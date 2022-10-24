import { has } from 'ramda'
import { createLogger, format, transport, transports } from 'winston'
import { PassThrough } from 'stream'

const prodTransports = [
  new transports.Console({
    format: format.combine(
      format.errors({ stack: true }),
      format.timestamp(),
      format.colorize(),
      format.simple()
    )
  }),
  new transports.File({ 
    filename: './logs/web-monitor.log',
    format: format.combine(
      format.errors({ stack: true }),
      format.timestamp(),
      format.json()
    ),
  })
]

// Prevent immutable winston warning to console about empty transports
const emptyTransports: transport[] = [
  new transports.Stream({ stream: new PassThrough() }) 
]

const disableLogging = process.env.NODE_ENV == 'test';
const selectedTransports: transport[] = (disableLogging) ? emptyTransports : prodTransports;

export default createLogger({
  level: 'info',
  transports: selectedTransports
})

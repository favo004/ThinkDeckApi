import { format, transports, createLogger, config } from 'winston'

export const logger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/server.log',
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${info.timestamp}: ${info.message}`)
            )
        })
})
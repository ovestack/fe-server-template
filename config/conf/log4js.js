var path = require('path')
var log4js = require('log4js')

var getLog = function(filename) {
    return path.resolve(__dirname, `../../logs/${filename}`)
}

const styles = {
    info: [36, 39],
    error: [35, 39],
    fatal: [31, 39],
    warn: [33, 39]
}

function colorizeStart(style) {
    return style ? `\x1B[${styles[style][0]}m` : ''
}

function colorizeEnd(style) {
    return style ? `\x1B[${styles[style][1]}m` : ''
}

function colorfulLog(level, log) {
    var style = level.toLowerCase()
    return `${colorizeStart(style)}${log}${colorizeEnd(style)}`
}

log4js.addLayout('nginx_log', (config) => {
    return (logEvent) => {
        var data = logEvent.data[0]
        data['request-time'] = new Date(logEvent.startTime).toLocaleString()
        data['level'] = logEvent.level.levelStr
        var log = '[:request-time] [:level] :remote-addr - -' +
        ' ":method :url :protocol/:http-version"' +
        ' :status :content-length ":referrer"' +
        ' ":user-agent"'
        Object.keys(data).forEach((key) => {
            log = log.replace(':' + key, data[key])
        })
        return log
    }
})

log4js.addLayout('nginx_log_dev', (config) => {
    return (logEvent) => {
        var data = logEvent.data[0]
        data['request-time'] = new Date(logEvent.startTime).toLocaleString()
        data['level'] = logEvent.level.levelStr
        var log = '[:request-time] [:level] - - ":method :url"'
        Object.keys(data).forEach((key) => {
            log = log.replace(':' + key, data[key])
        })
        return colorfulLog(logEvent.level.levelStr, log)
    }
})

exports.dev = {
    appenders: {
        http: {
            type: 'console',
            layout: {
                type: 'nginx_log_dev'
            }
        }
    },
    categories: {
        http: {
            appenders: ['http'],
            level: 'ALL'
        }
    }
}

exports.default = {
    appenders: {
        default: {
            type: 'console',
            layout: {
                type: 'coloured'
            }
        }
    },
    categories: {
        default: {
            appenders: ['default'],
            level: 'ALL'
        }
    }
}

exports.prod = {
    appenders: {
        multi: {
            type: 'multiFile',
            base: path.resolve(__dirname, '../../logs'),
            property: 'categoryName',
            extension: '.log',
            compress: true
        },
        http: {
            type: 'dateFile',
            filename: getLog('access.log'),
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            layout: {
                type: 'nginx_log'
            }
        }
    },
    categories: {
        default: {
            appenders: ['multi'],
            level: 'debug'
        },
        http: {
            appenders: ['http'],
            level: 'ALL'
        }
    },
    replaceConsole: true,
    pm2: true
}
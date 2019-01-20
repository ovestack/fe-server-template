module.exports = {
    env: 'development',
    db: 'mongodb://127.0.0.1:27017/app',
    mc: '127.0.0.1:11211',
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    use: [
        'redis',
        'template'
    ],
    middleware: [
        'log',
        'form',
        'url',
        'routerMap',
        'staticServer',
        'router'
    ],
    staticServer: {
        maxAge: 0,
        hidden: true
    },
    template: {
        cache: false
    },
    isLocal: true
}
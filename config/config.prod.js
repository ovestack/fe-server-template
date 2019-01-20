module.exports = {
    env: 'production',
    db: 'mongodb://127.0.0.1:27017/app',
    mc: '127.0.0.1:11211',
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password: ''
    },
    staticServer: {
        maxAge: 24 * 60 * 60
    },
    template: {
        cache: true
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
}
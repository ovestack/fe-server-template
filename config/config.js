var path = require('path')

exports = module.exports = {
    entry: '',
    version: '{{version}}',
    revision: false,
    port: 3000,
    routerPath: path.resolve(__dirname, '../controllers'),
    livereload: false,
    isLocal: true,
    redis: {
        showFriendlyErrorStack: true,
        keyPrefix: 'APP:'
    },
    use: [
        'log',
        'favicon',
        'session',
        'url',
        'routerMap',
        'html-processor',
        'staticServer',
        'client-debug',
        'form',
        'template',
        'redis',
        'router'{{#webpack}},
        'webpack-dev-server'{{/webpack}}
    ]
}
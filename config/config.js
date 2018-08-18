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
        'url',
        'routerMap',
        'html-processor',
        'staticServer',
        'client-debug',
        'form',
        'template',
        'router'{{#webpack}},
        'webpack-dev-server'{{/webpack}}
    ]
}
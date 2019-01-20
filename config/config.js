var path = require('path')

exports = module.exports = {
    entry: '',
    version: '{{version}}',
    revision: false,
    port: 3000,
    routerPath: path.resolve(__dirname, '../controllers'),
    livereload: false,
    redis: {
        showFriendlyErrorStack: true,
        keyPrefix: 'APP:'
    },
    use: [],
    middleware: [],
    form: {
        multipart: true,
        formidable: {
            keepExtensions: true,
            hash: 'sha1'
        }
    },
    staticServer: {
        dir: path.join(__dirname, '../public')
    },
    template: {
        root: path.join(__dirname, '../views'),
        layout: false,
        viewExt: 'html'
    }
}
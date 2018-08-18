var path = require('path')

exports.default = {
    inject: {
        '<!-- dllfile-inject -->': '<script src="/1.0.0/static/js/lib/dll.js"></script>'
    },
    config: {
        serverBundle: path.resolve(__dirname, '../../public/1.0.0/vue-ssr-server-bundle.json'),
        clientManifest: path.resolve(__dirname, '../../public/1.0.0/vue-ssr-client-manifest.json'),
        template: path.resolve(__dirname, '../../client/index.server.html')
    }
}
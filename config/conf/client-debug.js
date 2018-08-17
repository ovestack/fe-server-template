var path = require('path')

exports.default = {
    port: 10086,
    inject_file: path.resolve(__dirname, '../../components/client-debug/client_inject.js')
}

exports.dev = {
    enabled: true
}

exports.prod = {
    enabled: false
}


var path = require('path')

module.exports = {
    BASE_DIR: path.resolve(__dirname, '../../views'),
    STATIC_PATH: getConfig('staticServer.dir'),
    SUB_PATH: 'static'
}
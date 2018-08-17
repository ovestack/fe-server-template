'use strict'

var jwt = require('koa-jwt'),
    config = getConfig('jwt')

module.exports = function(app) {
    app.use(jwt(config))
}

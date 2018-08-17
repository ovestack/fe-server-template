'use strict'

var session = require('koa-session'),
    config = getConfig('session')

module.exports = function(app) {
    app.keys = config.sessionKeys
    app.use(session(config, app))
}
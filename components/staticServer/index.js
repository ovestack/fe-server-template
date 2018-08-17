'use strict'

var config = getConfig('staticConfig'),
    staticServe = require('koa-static')

module.exports = function(app) {
    app.use(staticServe(config.dir, config))
}

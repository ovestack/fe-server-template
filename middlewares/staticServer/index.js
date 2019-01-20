'use strict'

var config = getConfig('staticServer'),
    staticServe = require('koa-static')

module.exports = function(app) {
    app.use(staticServe(config.dir, config))
}

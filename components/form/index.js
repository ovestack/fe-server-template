'use strict'
var koaBody = require('koa-body'),
    config = getConfig('form')

module.exports = function(app) {
    app.use(koaBody(config))
}

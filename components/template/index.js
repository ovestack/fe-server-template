'use strict'

var render = require('koa-ejs'),
    config = getConfig('template')

module.exports = function(app) {
    render(app, config)
}

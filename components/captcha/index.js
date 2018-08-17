'use strict'

var captcha = require('koa-captcha'),
    config = getConfig('captcha')

module.exports = function(app) {
    app.use(captcha(config))
}

'use strict'
var Koa = require('koa'),
	app = module.exports = new Koa()

require('./boot.js')

var ErrorLogger = getLogger('error'),
	config = getConfig(),
	PORT = config.port

if (config.use) {
    config.use.forEach(component => {
        let mod = requireMod(component)
        if (typeof mod === 'function') {
            mod(app)
        }
        mod = null
    })
}

app.listen(PORT)

process.on('uncaughtException', (err) => {
    ErrorLogger.error(err.message)
})
.on('unhandledRejection', (err) => {
    ErrorLogger.error(err.message)
})
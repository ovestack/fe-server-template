'use strict'
var config = getConfig('staticConfig'),
    path = require('path'),
    fs = require('fs')

const Cache = requireMod('cache')
const CACHE_MOD = 'FAVICON'
const CACHE_KEY = 'icon'

var cache = new Cache(CACHE_MOD)

module.exports = function(app) {
    app.use(async (ctx, next) => {
        var url = ctx.url,
            ret
        if (url === '/favicon.ico') {
            ret = cache.get(CACHE_KEY)
            if (ret) {
                ctx.set('cache','hint')
            } else {
                let favicon_url = path.resolve(config.dir, 'favicon.ico')
                if (!fs.accessSync(favicon_url)) {
                    ret = fs.readFileSync(favicon_url)
                    cache.set(CACHE_KEY, ret)
                }
            }
            ctx.type = 'image/x-icon'
            ctx.body = ret
        } else {
            await next()
        }
    })
}

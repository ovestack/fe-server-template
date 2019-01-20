'use strict'
var config = getConfig()

module.exports = function(app) {
    app.use(async (ctx, next) => {
        var url = ctx.request.url
        if (url === '/') {
            if (config.entry) {
                ctx.redirect(config.entry)
            } else {
                await next()
            }
        } else {
            await next()
        }
    })
}
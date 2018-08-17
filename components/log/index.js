var logger = getLogger('http')

var getVars = function(ctx) {
    return {
        'remote-addr': ctx.ip,
        'method': ctx.method,
        'url': ctx.url,
        'protocol': ctx.protocol,
        'http-version': ctx.req.httpVersion,
        'status': ctx.status,
        'content-length': ctx.length || 0,
        'referrer': ctx.get('referrer'),
        'user-agent': ctx.get('user-agent')
    }
}

module.exports = function(app) {
    app.use(async (ctx, next) => {
        await next()
        if (ctx.status >= 200 && ctx.status < 300 || ctx.status === 304) {
            logger.info(getVars(ctx))
        } else if (ctx.status >= 500) {
            logger.fatal(getVars(ctx))
        } else {
            logger.error(getVars(ctx))
        }
    })
}
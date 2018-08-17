var logger = global.getLogger('test')
module.exports = function(test) {
    test.use(async (ctx, next) => {
        var origin = ctx.get('origin') || '*'
        var header = {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': origin
          }
        ctx.set(header)
        await next()
    })
    test.get('/test.gif', async (ctx, next) => {
        logger.info('hint')
        ctx.set('Content-Type', 'image/gif')
        ctx.body = ''
    })
}

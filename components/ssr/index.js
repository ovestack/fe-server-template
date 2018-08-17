const fs = require('fs')
const config = getConfig('ssr')
const ssrConfig = getConfig('ssr').config
var template = fs.readFileSync(ssrConfig.template, 'utf-8')
if (config.inject) {
    Object.keys(config.inject).forEach(function(key) {
        template = template.replace(key, config.inject[key])
    })
}
const util = requireMod('util')
const logger = getLogger('ssr')
const Router = require('koa-router')
module.exports = function (app) {
    // var r = new Router()
    // r.get('/test', async (ctx) => {
    //     console.log('xxxx')
    // })
    // app.use(r.routes())
    var router = new Router()
    router.get('*', async (ctx, next) => {
        util.reload_module(ssrConfig.serverBundle)
        util.reload_module(ssrConfig.clientManifest)
        const bundle = require(ssrConfig.serverBundle)
        const renderer = require('vue-server-renderer').createBundleRenderer(bundle, {
            runInNewContext: false,
            clientManifest: require(ssrConfig.clientManifest),
            template
        })
        const renderToString = requireMod('util').promisify(renderer.renderToString)
        const context = {
            url: ctx.url
        }
        try {
            let html = await renderToString(context)
            // html = html.replace('{__INITIAL_STATE__}', JSON.stringify(context.state))
            ctx.body = html
        } catch (err) {
            logger.error(err)
            await next()
        }
    })
    app.use(router.routes())
}
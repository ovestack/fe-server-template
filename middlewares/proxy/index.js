'use strict'
var httpProxy = require('http-proxy'),
    config = getConfig('proxy')
var proxy = httpProxy.createProxyServer()

proxy.on('proxyReq', function(proxyReq, req, res, options) {

})

module.exports = function(app) {
    app.use(async (ctx, next) => {
        var req = ctx.req,
            res = ctx.res
        if (config[ctx.path]) {
            let option = config[ctx.path]
            await new Promise(function(resolve,reject) {
                proxy.web(req, res, option,function(err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(null)
                    }
                })
            })
        } else {
           await next()
        }
    })
}
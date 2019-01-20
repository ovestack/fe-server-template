'use strict'
var util = requireMod('util')
var routerMap = getConfig('routerMap'),
    pathToRegexp = require('path-to-regexp')

var config = getConfig()

function replaceParams(redirectUrl, vars) {
    var reg = new RegExp('\\$', 'g'),
        vars = Object.assign({}, config, vars)
    redirectUrl = redirectUrl.replace(reg, ':')
    return pathToRegexp.compile(redirectUrl)(vars)
}

function getRouterVars(vars, matched) {
    var ret = {}
    vars.forEach(function(key, index) {
        ret[key] = matched[index]
    })
    return ret
}

const ROUTER_MAP_REGS = {}

Object.keys(routerMap).forEach(function(key) {
    ROUTER_MAP_REGS[key] = pathToRegexp(key)
})

module.exports = function(app) {
    app.use(async (ctx, next) => {
        var req = ctx.request,
            url = ctx.url
        for (var i in ROUTER_MAP_REGS) {
            if (ROUTER_MAP_REGS.hasOwnProperty(i)) {
                var reg = ROUTER_MAP_REGS[i],
                    vars = reg.keys.map(function(key) {
                        return key.name
                    }),
                    matched = url.match(reg)
                if (matched) {
                    let handle = routerMap[i]
                    if (util.isAsync(handle)) {
                        return await handle(ctx, ...matched.slice(1).concat(next))
                    } else if (util.isFunction(handle)) {
                        handle(ctx, ...matched.slice(1))
                    } else if (util.isString(handle)) {
                        vars = getRouterVars(vars, matched.slice(1))
                        ctx.redirect(replaceParams(handle, vars))
                    }
                    break
                }
            }
        }
        await next()
    })
}

'use strict'
var path = require('path'),
    fs = require('fs'),
    injection = requireMod('injection'),
    staticConfig = getConfig('staticServer'),
    url = require('url'),
    html_processor_config = getConfig('html-processor'),
    config = getConfig(),
    client_debug_config = getConfig('client-debug')

const Cache = requireMod('cache')
const CACHE_MOD = 'html'

var cache = new Cache(CACHE_MOD)

var isHtml = function(input) {
    if (!input) return false
    input = url.parse(input)
    if (input = input.pathname) {
        return path.extname(input) === '.html' || path.extname(input) === '.htm'
    } else {
        return false
    }
}

var fileExists = function(route_url) {
    route_url = url.parse(route_url).pathname
    var trueFile = path.join(staticConfig.dir, route_url)
    try {
        fs.accessSync(trueFile)
    } catch (e) {
        return false
    }
    return true
}

var isPath = function(route_url) {
    route_url = path.join(staticConfig.dir, route_url)
    try {
        var stat = fs.statSync(route_url)
        return stat.isDirectory()
    } catch (e) {
        return false
    }
}

var getContent = function(url) {
    var trueFile = path.join(staticConfig.dir, url),
        ret
    if (ret = cache.get(url)) {
        this.set('html-cache', 'hint')
    } else {
        ret = fs.readFileSync(trueFile,'utf-8')
        ret = injection(ret)
        if (config.livereload) {
            ret += '<script src="http://localhost:35729/livereload.js"></script>'
        }
        if (client_debug_config.enabled && config.env !== 'production') {
            let inject_lib = fs.readFileSync(client_debug_config.inject_file).toString()
            inject_lib = inject_lib.replace('{port}', client_debug_config.port)
            ret = '<script>' + inject_lib + '</script>' + ret
        }
        if (config.env === 'production') {
            cache.set(url, ret)
        }
    }
    return ret
}

module.exports = function(app) {
    app.use(async (ctx, next) => {
        if (html_processor_config.enabled) {
            var route_url = ctx.url
            // 如果是根目录，判断目录下是否有index.html文件
            // todo 增加动态路由过滤
            if (isPath(route_url)) {
                if (!route_url.endsWith('/')) {
                    route_url += '/'
                }
                route_url += 'index.html'
            }
            if (isHtml(route_url)) {
                if (fileExists(route_url)) {
                    ctx.type = 'html'
                    ctx.body = getContent.call(ctx, url.parse(route_url).pathname)
                } else {
                    await next()
                }
            } else {
                await next()
            }
        } else {
            await next()
        }
    })
}
'use strict'
var fs = require('fs'),
    path = require('path'),
    Router = require('koa-router'),
    logger = getLogger('router')

var config = getConfig()

const CONTROLLER_PATH = config.routerPath

var walk = function(dir, cb) {
    var files = fs.readdirSync(dir)
    for (var i = 0, l = files.length; i < l; i++) {
        let file = files[i]
        let truePath = path.join(dir, file)
        let stat = fs.statSync(truePath)
        if (stat.isDirectory()) {
            cb(truePath)
            walk(truePath, cb)
        }
    }
}

var requireController = function(app, dir) {
    let controller = require(dir)
    if (typeof controller === 'function') {
        let ns = (dir.replace(CONTROLLER_PATH, '') || '').replace(path.sep, '/')
        let subRouter = new Router({
            prefix: ns
        })
        controller(subRouter)
        app.use(subRouter.routes())
        subRouter.stack.map(route => {
            if (route.methods && route.methods.length) {
                logger.info(`挂载路由 ===> ${route.path}`)
            }
        })
    }
}

module.exports = (app) => {
    requireController(app, CONTROLLER_PATH)
    walk(CONTROLLER_PATH, (dir) => {
        requireController(app, dir)
    })

}

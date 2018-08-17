var http = require('http'),
    sio = require('socket.io'),
    config = getConfig('client-debug')

module.exports = function(app) {
    if (!config.enabled) return
    var server = http.createServer(app.callback()),
        io = sio(server)

    io.on('connection', function(socket){
        io.emit('connected', 'socket online')
        socket.on('client_debug', function(data) {
            data = JSON.parse(data)
            if (typeof data.msg !== 'string') {
                data.msg = JSON.stringify(data.msg)
            }
            switch (data.type) {
                case 'log':
                    console.log('\x1B[32m[' + (new Date) + '] [CLIENT-LOG] log \x1B[39m' + data.msg)
                    break
                case 'warn':
                    console.log('\x1B[33m[' + (new Date) + '] [CLIENT-LOG] warn \x1B[39m' + data.msg)
                    break
                case 'error':
                    console.log('\x1B[31m[' + (new Date) + '] [CLIENT-LOG] error \x1B[39m' + data.msg)
                    break
            }
        })
    })

    server.listen(config.port)
}
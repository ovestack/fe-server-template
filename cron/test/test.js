'use strict'

module.exports = {
    type: 'interval',
    enable: false,
    config: {
        delay: 2,
        callback: function() {
            return console.log('hint')
        },
        repeat: 3,
        name: 'test cron'
    }
}

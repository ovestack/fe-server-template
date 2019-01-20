exports.dev = {
    'test interval': {
        delay: 2,
        repeat: 3,
        type: 'interval'
    },
    'test schedule': {
        type: 'schedule',
        delay: 1,
        args: [1, 2],
        enable: false
    }
}
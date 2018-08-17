module.exports = {
    type: 'schedule',
    config: {
        delay: 1,
        args: [1,2],
        callback: function(a,b) {
            console.log('hello',a,b)
        }
    }
}
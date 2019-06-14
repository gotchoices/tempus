//master Timer

var timerID;
var callbacks = {}
var mSeconds = 10000

module.exports={
  start: function(mSeconds) {
    timerID = setInterval(function() {
      Object.keys(callbacks).forEach(id=>{
        callbacks[id]()
        //console.log("mSeconds", mSeconds)
      })
    }, mSeconds)
  },

  register: function(id, callback) {
    if (callback)
      callbacks[id] = callback
    else if (id in callbacks)
      delete callbacks[id]
  },

  stop: function() {
    clearInterval(timerID)
  },

}

//handles incoming packets from the client

var db = {}

module.exports={
  handle: function(packet, cb) {
    switch (packet.type) {
      case 'score':
        handleScore(packet, cb)
        break;
      case 'offer':
        handleOffer(packet, cb)
        break;
      case 'register':
        this.handleRegister(packet, cb)
        break;
      default:
        console.log("Error with sent packet")
    }
  },

  handleRegister: function(packet, cb) {
    db.user = packet.user
    cb({type: 'return', id: packet.id, status: 'good'})
  }


}

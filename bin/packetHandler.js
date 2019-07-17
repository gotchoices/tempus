//handles incoming packets from the client

var db = {
  users: [],
  scores: [],
  offers: [],
}

module.exports={
  handle: function(packet, cb) {
    switch (packet.type) {
      case 'scores':
        this.handleScores(packet, cb)
        break;
      case 'offer':
        this.handleOffer(packet, cb)
        break;
      case 'register':
        this.handleRegister(packet, cb)
        break;
      default:
        console.log("Error with sent packet")
    }
  },

  handleRegister: function(packet, cb) {
    db.users.push[packet.user]
    cb({type: 'return', id: packet.id, status: 'good',})
  },

  handleScores: function(packet, cb) {
    db.scores.push[{user: packet.user, score: packet.score}]
    var tempScores = ['1', '2', '3', '4',]
    var temp
    var i = 0
    for (i = 0; i < db.scores.length; i++) {
      temp = db.scores.user + ': ' + db.scores.score
      console.log(temp)
      tempScores.push(7)
    }
    cb({type: 'return', id: packet.id, status: 'good', scores: tempScores,})
  },

  handleOffer: function(packet, cb) {
    db.offers.push[{user: packet.user, offer: packet.offer, amount: packet.amount,}]
    cb({type: 'return', id: packet.id, status: 'good', message: 'Offer Posted'})
  },


}

//handles incoming packets from the client

var db = {
  users: [],
  scores: [],
  offers: [{user: 'testUser', id: 'testUser1', offerType: 'capital', acceptType: 'commodity',
    tradeTitle: 'Hospital', acceptTitle: 'Materials', toTrade: 2, amountOut: null, toAccept: 1, amountIn: 5,},],
}

module.exports={
  handle: function(packet, cb) {
    //console.log("in handle")
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
      case 'getOffers':
        this.handleGetOffers(packet, cb)
        break;
      case 'acceptOffer':
        this.handleAcceptOffer(packet, cb)
        break;
      default:
        console.log("Error with sent packet")
    }
  },

  handleRegister: function(packet, cb) {
    db.users.push(packet.user)
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
    db.offers.push({user: packet.user, id: packet.id, toOriginalUser: cb, offerType: packet.offerType,
      acceptType: packet.acceptType, tradeTitle: packet.tradeTitle, acceptTitle: packet.acceptTitle,
      toTrade: packet.toTrade, amountOut: packet.amountOut, toAccept: packet.toAccept, amountIn: packet.amountIn})
    cb({type: 'offerPosted', id: packet.id, status: 'good', message: 'Offer Posted'})
  },

  handleGetOffers: function(packet, cb) {
    var i = 0
    var myOffers = []
    var otherOffers = []
    for (i = 0; i < db.offers.length; i++) {
      if (db.offers[i].user == packet.user) {
        myOffers.push(db.offers[i])
      }
      else {
        otherOffers.push(db.offers[i])
      }
    }
    cb({type: 'return', id: packet.id, status:  'good', myOffers: myOffers, otherOffers: otherOffers,})
  },

  handleAcceptOffer: function(packet, cb) {
    var currOffer = null
    //sends packet to user who accepted the offer
    for (var i = 0; i < db.offers.length; i++) {
      if (db.offers[i].id == packet.offerToAccept) {
        currOffer = db.offers[i]
        break
      }
    }
    cb({type: 'return', id: packet.id, status: 'good', offer: currOffer,})
    //sends packet to user that posted the offer
    currOffer.type = 'offerAccepted'
    currOffer.toOriginalUser(currOffer)
    //delete offer
    db.offers.splice(db.offers.indexOf(currOffer), 1)
  },

}

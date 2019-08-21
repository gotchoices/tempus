//handles incoming packets from the client

var db = {
  users: [],
  scores: [],
  offers: [{user: 'testUser', id: 'testUser1', offerType: 'capital', acceptType: 'commodity',
    tradeTitle: 'Hospital', acceptTitle: 'Materials', toTrade: 2, amountOut: null, lengthOut: null,
    toAccept: 1, amountIn: 5, lengthIn: null,},],
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
      case 'recordScore':
        this.handleRecordScore(packet, cb)
        break;
      case 'removeOffer':
        this.handleRemoveOffer(packet, cb)
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
    //db.scores.push({user: packet.user, score: packet.score})
    console.log(db.scores)
    var tempScores = []
    var temp = null
    for (var i = 0; i < db.scores.length; i++) {
      temp = db.scores[i].user + ': ' + db.scores[i].score
      console.log(temp)
      tempScores.push(temp)
    }
    cb({type: 'return', id: packet.id, status: 'good', scores: tempScores,})
  },

  handleOffer: function(packet, cb) {
    db.offers.push({user: packet.user, id: packet.id, toOriginalUser: cb, offerType: packet.offerType,
      acceptType: packet.acceptType, tradeTitle: packet.tradeTitle, acceptTitle: packet.acceptTitle,
      toTrade: packet.toTrade, amountOut: packet.amountOut, lengthOut: packet.lengthOut,
      toAccept: packet.toAccept, amountIn: packet.amountIn, lengthIn: packet.lengthIn,})
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

  handleRecordScore: function(packet, cb) {
    if (db.scores.length === 0) {
      db.scores.push({user: packet.user, score: packet.score})
    }
    for (var i = 0; i < db.scores.length; i++) {
      if (packet.user === db.scores[i].user) {
        db.scores[i].score = packet.score
        break
      }
      if (i === db.scores.length) {
        db.scores.push({user: packet.user, score: packet.score})
      }
    }
    cb({type: 'return', id: packet.id, status: 'good',})
  },

  handleRemoveOffer: function(packet, cb) {
    var tempOffer = null
    for (var i = 0; i < db.offers.length;  i++) {
      if (db.offers[i].id === packet.offer) {
        tempOffer = db.offers[i]
        db.offers.splice(i, 1)
        break
      }
    }
    cb({type: 'return', id: packet.id, status: 'good', offer: tempOffer,})
  },

}

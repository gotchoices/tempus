//registers packages sent to the server

var packets = {}

module.exports={

  register: function(packet) {
    packets[packet.id] = packet
  },
  recieved: function(returnPacket) {
    if (returnPacket.type === 'offerAccepted') {
      var offered = null
      var received = null
      //handle offerAccepted
      if (returnPacket.offer.offerType === 'capital') {
        this.buildings[returnPacket.offer.toTrade].owned = false
        offered = "a" + returnPacket.offer.tradeTitle
      }
      else if (returnPacket.offer.offerType === 'commodity') {
        this.buildings[returnPacket.offer.toTrade].commodityAmount -= returnPacket.offer.amountOut
        offered = returnPacket.offer.amountOut + " " + returnPacket.offer.tradeTitle
      }
      if (returnPacket.offer.acceptType === 'capital') {
        this.buildings[returnPacket.offer.toAccept].owned = true
        received = "a" + returnPacket.offer.acceptTitle
      }
      else if (returnPacket.offer.acceptType === 'commodity') {
        this.buildings[returnPacket.offer.toAccept].commodityAmount += returnPacket.offer.amountIn
        received = returnPacket.offer.amountIn + " " + returnPacket.offer.acceptTitle
      }
      this.newNotification = true
      this.notifications.push({message: "Your offer for " + offered + " has been accepted. You have received " + received})
      delete packets[returnPacket.id]
    }
    if (returnPacket.id in packets) {
      //call callback and delete packet
      packets[returnPacket.id].cb(returnPacket)
      if (returnPacket.type != 'offerPosted') {
        delete packets[returnPacket.id]
      }
      //console.log("Packet recieved, status: ", returnPacket.status)
    }
    else {
      console.log("Unknown packet recieved, id: ", returnPacket.id)
    }
  }
}

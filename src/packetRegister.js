//registers packages sent to the server

var packets = {}

module.exports={

  register: function(packet) {
    packets[packet.id] = packet
  },
  recieved: function(returnPacket) {
    if (returnPacket.type === 'offerAccepted') {
      //handle offerAccepted
      if (returnPacket.offer.offerType === 'capital') {
        this.buildings[returnPacket.offer.toOffer].owned = false
      }
      else if (returnPacket.offer.offerType === 'commodity') {
        this.buildings[returnPacket.offer.toOffer].commodityAmount -= returnPacket.offer.amountOut
      }
      if (returnPacket.offer.acceptType === 'capital') {
        this.buildings[returnPacket.offer.toAccept].owned = true
      }
      else if (returnPacket.offer.acceptType === 'commodity') {
        this.buildings[returnPacket.offer.toAccept].commodityAmount += returnPacket.offer.amountIn
      }
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

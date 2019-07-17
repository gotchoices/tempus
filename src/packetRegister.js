//registers packages sent to the server

var packets = {}

module.exports={

  register: function(packet) {
    packets[packet.id] = packet
  },
  recieved: function(returnPacket) {
    if (returnPacket.id in packets) {
      //call callback and delete packet
      packets[returnPacket.id].cb(returnPacket)
      delete packets[returnPacket.id]
      console.log("Packet recieved, status: ", returnPacket.status)
    }
  }
}

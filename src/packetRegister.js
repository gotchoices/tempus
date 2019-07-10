//registers packages sent to the server

var packets = {}

module.exports={

  register: function(packet) {
    packets[packet.id] = packet
  },
  recieved: function(packet) {
    if (packet.id in packets) {
      //call callback and delete packet
      packets[packet.id].cb()
      delete packets[packet.id]
      console.log("Packet recieved, status: ", packet.status)
    }
  }
}

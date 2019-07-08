#!/usr/bin/env node

const Express = require('express')
const Http = require('http')

var expApp = Express()
var server = Http.createServer(expApp)
expApp.use(Express.static('dist'))

server.listen(4000)

const Ws = require('ws')
var wsServer = Http.createServer()
var wsSocket = new Ws.Server({
  server: wsServer,
  clientTracking: true,
})

wsServer.listen(4001)
wsSocket.on('connection', (ws) => {
  console.log("WS connected")

  ws.on('close', (code, reason) => {
    console.log("WS connection closed")
  })

  ws.on('message', (msg) => {
    console.log("Incoming message: " + msg)
    let packet = JSON.parse(msg)
    ws.send(JSON.stringify({msg: "OK"}))
  })
})

//packet handlers
handle: function(packet) {
  switch (packet.type) {
    case 'score':
      handleScore(packet)
      break;
    case 'offer':
      handleOffer(packet)
      break;
    case 'register':
      handleRegister(packet)
      break;
    default:
      console.log("Error with sent packet")
  }
}

handleScore(packet) {
  
}

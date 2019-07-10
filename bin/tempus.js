#!/usr/bin/env node

const PacketHandler = require('./packetHandler.js')
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
    PacketHandler.handle(packet, (returnPacket) => {
      if (returnPacket) {
        ws.send(JSON.stringify(returnPacket))
      }
    })
  })
})

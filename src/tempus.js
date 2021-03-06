//Tempus Valorem
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
// TODO:
//-
import Vue from 'vue'
Vue.config.productionTip = false

const Template = `
  <div class="tempus">
    <div class="register" v-if="showRegisterDialog">
      <p>Register Your Username</p>
      <input v-model="user" placeholder="Your username"></input>
      <button @click="registerUsername(user)"> Register </button>
      <p>{{registerMessage}}</p>
    </div>
    <span class="open" @click="postMenu(null, null)">
      <img class="icon" :src="menuIcon" />
    </span>
    <button @click="startTimer"> Start Timer </button>
    <button @click="stopTimer"> Stop Timer </button>
    <button @click="removeBuilding(0)"> Remove Farm </button>
    <button @click="changeMaxTime(-20, 5)"> Change Time </button>
    <span class="open" id="notificationButton" @click="toggleNotifications">
      <img class="icon" :src="notificationIcon" />
    </span>
    <span class="open" id="marketButton" @click="toggleMarket">
      <img class="icon" src="icons/trading.png"/>
    </span>
    <tempus-menu
      v-on:post-menu="postMenu"
      v-on:add-building="addBuilding"
      v-on:fetch-scores="fetchScores"
      v-on:none="xyz"
      :config="menuConfig[menuOptions.currMenu]"
      :options="menuOptions"/>
    <tempus-market
      v-on:toggle-market="toggleMarket"
      v-on:accept-offer="acceptOffer"
      v-on:toggle-trade-dialog="toggleTradeDialog"
      v-on:remove-offer="removeOffer"
      v-on:get-offers="getOffers"
      :buildings="buildings"
      :myOffers="myOffers"
      :otherOffers="otherOffers"
      :options="marketOptions"/>
    <tempus-commodities :buildings="buildings" :maxTime="maxTime"/>
    <svg class="tempus tempus-board" :viewBox="viewCoords">
      <path fill="none" stroke="blue" :d="svgOutline"> </path>
      <tempus-time
        x="1"
        y="1"
        size="50"
        :currSeconds="currSeconds"
        :currMinutes="currMinutes"
        @drag="doDrag"/>
      <tempus-score v-if="!showRegisterDialog":score="score" :user="user"/>
      <tempus-building
        v-for="(building, index) in showingBuildings"
        v-on:increment-percent="incrementPercent"
        v-on:decrement-percent="decrementPercent"
        v-on:add-commodity="addCommodity"
        v-on:toggle-trade-dialog="toggleTradeDialog"
        :build="building"
        :key="building.index"
        :index="index"
      />
      <rect class="valueBar" style="fill:#b8cae0;fill-opacity:1;stroke-width:0.26"
        :width="val.width" :height="val.height"
        :x="val.x" :y="val.y" :ry="val.ry"
      />
      <tempus-value
      v-for="(value, index) in values"
      v-on:increment-percent="incrementPercent"
      v-on:decrement-percent="decrementPercent"
      v-on:update-score="updateScore"
      :key="value.title"
      :data="value"
      :config="valuesConfig"
      :index="index"
      />

    </svg>
    <tempus-trade-dialog
      :config="tradeDialogConfig"
      :buildings="showingBuildings"
      :allBuildings="buildings"
      :maxTime="maxTime"
      v-on:toggle-trade-dialog="toggleTradeDialog"
      v-on:post-offer="postOffer"
      />
    <tempus-notify
      :config="notifyConfig"
      :notes="notifications"
      v-on:toggle-notify="toggleNotifications"
      />

    <h1 class="gameOver" v-if="endText.show"> {{endText.text}} </h1>
    <div class="blankSpace" v-if="screenIsBlank" @click="blankClicked"/>
  </div>
`

import TempusTime from './time.vue'
import TempusMenu from './menu.vue'
import TempusBuilding from './building.vue'
import TempusValue from './value.vue'
import TempusMarket from './market.vue'
import TempusTradeDialog from './tradeDialog.vue'
import TempusScore from './score.vue'
import TempusCommodities from './commodities.vue'
import TempusNotify from './notify.vue'
var BuildingStartPos = 70
const Timer = require('./timer.js')
const PacketRegister = require('./packetRegister.js')
const Uuidv1 = require('uuid/v1');

const Config = {
  el: '#app',
  template: Template,
  components: { 'tempus-time': TempusTime, 'tempus-menu': TempusMenu,
    'tempus-building': TempusBuilding, 'tempus-value': TempusValue,
    'tempus-market': TempusMarket, 'tempus-trade-dialog': TempusTradeDialog,
    'tempus-score': TempusScore, 'tempus-commodities': TempusCommodities,
    'tempus-notify': TempusNotify,},
  data() { return {
    minX:	0,
    minY:	0,
    maxX:	300,
    maxY:	300,
    menuIcon: 'icons/right-arrow.png',
    showFarm: false,
    showFactory: false,
    timeUsers: [],
    timeUsersIterator: 0,
    score: 0,
    timeCounter: 0,
    user: "",
    userId: null,
    registerMessage: "",
    showRegisterDialog: true,
    uniqueId: 0,
    showingBuildings: [],
    buildings: [
      {index: 0, title: 'Farm', commodityTitle: 'Food', commodityAmount: 0, commodityReserved: 0,
        commodityMax: 50, rate: 0.1, position: BuildingStartPos, buildTime: 300, owned: false,
        built: false, percent: 0,},
      {index: 1, title: 'Factory', commodityTitle: 'Materials', commodityAmount: 0, commodityReserved: 0,
        commodityMax: 40, rate: 0.1, position: BuildingStartPos, buildTime: 300, owned: false,
        built: false, percent: 0,},
      {index: 2, title: 'Hospital', commodityTitle: 'Medicine', commodityAmount: 0, commodityReserved: 0,
        commodityMax: 20, rate: 0.1, position: BuildingStartPos, buildTime: 300, owned: false,
        built: false, percent: 0,},
    ],
    menuConfig: [
      {index: 0, code: 'main', title: 'Menu', prevMenu: null, subMenu:
        [{name: 'Buildings', link: 1, method: 'post-menu',},
        {name: 'Settings', link: 2, method: 'post-menu',},
        {name: 'Scores', link: 3, method: 'post-menu',},]},
      {index: 1, code: 'build', title: 'Buildings', prevMenu: null, subMenu:
        [{name: 'Farm', link: 0, method: 'add-building',},
        {name: 'Factory', link: 1, method: 'add-building',},
        {name: 'Hospital', link: 2, method: 'add-building',},]},
      {index: 2, code: 'set', title: 'Settings', prevMenu: null, subMenu: [],},
      {index: 3, code: 'score', title: 'Scores', prevMenu: null, subMenu:
        [{name: 'Update Scores', link: 0, method: 'fetch-scores',}],},
    ],
    menuOptions: {width: 0, prevMenu: null, currMenu: 0,},
    marketOptions: {width: 0, message: ""},
    values: [
      {index:100, title: 'Idleness', timer: null, arrows: true, percent: 100, mltplr: 0.5, scale: 0,},
      {index:101, title: 'Health', timer: 100, arrows: true, percent: 0, mltplr: 1, scale: 0.5,},
      {index:102, title: 'Comfort', timer: null, arrows: true, percent: 0, mltplr: 1, scale: 0.2,},
      {index:103, title: 'Experiences', timer: null, arrows: true, percent: 0, mltplr: 1, scale: 0.2,},
      {index:104, title: 'Wealth', timer: null, arrows: false, percent: 0, mltplr: 1, scale: 0,},
    ],
    valuesConfig: {x: 15, y: 205, ry: 1.8, width: 45, height: 30,},
    val: {x: 10, y: 200, ry: 1.8, width: 255, height: 40,},
    myOffers: [],
    otherOffers: [],
    tradeDialogConfig: {width: 0, showing: false, message: "",},
    notifyConfig: {width: 0, showing: false,},
    endText: {text: 'Game Over', show: false},
    wsHandler: null,
    screenIsBlank: false,
    dialogToClose: null,
    newNotification: false,
    notifications: [],
    maxTime: 100,
    timeOut: {index: 201, title: 'Time Out', percent: 0},
    timers: [], //{amount, cb}
    currSeconds: 0,
    currMinutes: 5,
  }},
  computed: {
    width: function() {return this.maxX - this.minX},
    height: function() {return this.maxY - this.minY},
    viewHeight: function() {return this.width * this.viewAspect},
    viewBottom: function() {return this.minY + this.viewHeight},
    viewAspect: function() {let a = this.fullScreen; return window.innerHeight / window.innerWidth},
    viewCoords: function() {		//Viewport of SVG space
      //console.log('Re-render:', this.minX, this.minY, this.width, this.viewBottom)
      //need to change return statement fourth parameter back to viewBottom
      return [this.minX, this.minY, this.width, this.height].join(' ')
    },
    svgOutline: function() {return `M ${this.minX}, ${this.minY} H ${this.maxX} V ${this.maxY} H ${this.minX} V ${this.minY} Z`},
    numActiveTimeUsers: function() {
      var num = 0
      for (var i = 1; i < this.timeUsers.length; i++) { //start at 1 to avoid timeOut
        if (this.timeUsers[i].percent != 0) {
          num++
        }
      }
      //console.log("numActiveTimeUsers: ", num)
      return num
    },
    notificationIcon: function() {
      if (this.newNotification) {
        return "icons/newNotification.png"
      }
      else {
        return "icons/notification.png"
      }
    },
  },
  methods: {
    xyz() {
      return null
    },
    doDrag(e) {
      console.log("Dragging:", e)
      //Insert code here to move item x,y location
    },
    updateScore: function(newPoints) {
      this.score += newPoints
      //console.log('Score: ', this.score)
    },
    postMenu: function(index, current) {
      //console.log('postMenu: {index: ' + index + ', current: ' + current + '}')
      if(index != null) {   //go to a link
        this.menuOptions.currMenu = index
        this.menuConfig[index].prevMenu = current
      }
      else {
        if (this.menuOptions.width == 0) {  //open menu
          this.blankScreen('menu')
          this.menuOptions.currMenu = 0
          this.menuConfig[0].prevMenu = null
          this.menuOptions.width = 250
        }
        else if (current == 0) {  //close menu
          this.blankScreen('menu')
          this.menuOptions.width = 0
          this.menuOptions.currMenu = 0
          this.menuConfig[0].prevMenu = null
        }
        else {  //go back a page
          this.menuOptions.currMenu = this.menuConfig[current].prevMenu
          this.menuConfig[current].prevMenu = null
        }
      }
      //console.log('width: ', this.menuOptions.width)
    },
    toggleMarket: function() {
      this.blankScreen('market')
      if (this.marketOptions.width == 0) {
        this.marketOptions.width = 250
        this.getOffers()
      }
      else {
        this.marketOptions.width = 0
        this.marketOptions.message = null
      }
    },
    addBuilding: function(index, notUsing) {  //notUsing only neccesary for compatibility with menu.vue
      //console.log(this.buildings[index].showBuilding)
      if (this.timeUsers.indexOf(this.buildings[index]) == -1) {  //checks if already added
        this.timeUsers.push(this.buildings[index])
      }
      if (this.showingBuildings.indexOf(this.buildings[index]) == -1) { //checks if already added
        this.showingBuildings.push(this.buildings[index])
        this.buildings[index].owned = true
        //console.log("Added ", this.buildings[index].title)
        //console.log("showingBuildings.length = ", this.showingBuildings.length)
      }
      //this.buildings[index].showBuilding = !this.buildings[index].showBuilding
      //console.log(this.timeUsers.length)
    },
    removeBuilding: function(index) {
      if (this.timeUsers.indexOf(this.buildings[index]) != -1) { //checks if it is actually there
        var i = this.timeUsers.indexOf(this.buildings[index])
        this.timeUsers.splice(i, 1)
      }
      else {
        console.log("Error, attempted to remove a building from timeUsers that was not present")
      }
      if (this.showingBuildings.indexOf(this.buildings[index]) != -1) {
        var j = this.showingBuildings.indexOf(this.buildings[index])
        this.showingBuildings.splice(j, 1)
        this.buildings[index].owned = false
        this.buildings[index].built = false
        for (var i = 0; i < this.buildings[index].percent; i++) {
          this.decrementPercent(this.buildings[index].index)
        }
        //console.log("Removed ", this.buildings[index].title)
      }
      else {
        console.log("Error, attempted to remove a building from showingBuildings that was not present")
      }
    },
    incrementPercent: function(id) {
      //find index
      //console.log("increment: ", id)
      var index = 0
      for (var i = 0; i < this.timeUsers.length; i++) {
        if (this.timeUsers[i].index == id) {
          index = i
          break
        }
      }
      //if percent already at max allowed
      if (this.timeUsers[index].percent >= this.maxTime && index != 0) {
        return
      }
      //if idleness has greater than 0 and not incrementing idleness, take from idleness
      if (this.timeUsers[1].percent != 0 && index != 1) {
        this.timeUsers[index].percent++
        this.timeUsers[1].percent--
        return
      }
      //if iterator needed
      this.rebalancePercent(index, 'up')
    },
    decrementPercent: function(id) {
      //find index
      var index = 0
      for (var i = 0; i < this.timeUsers.length; i++) {
        if (this.timeUsers[i].index == id) {
          index = i
          break
        }
      }
      //if percent already at 0
      if (this.timeUsers[index].percent == 0) {
        return
      }
      //if idleness is 100, add to Health
      if (this.timeUsers[1].percent >= this.maxTime && index == 1) {
        this.timeUsers[1].percent--
        this.timeUsers[2].percent++
        return
      }
      this.rebalancePercent(index, 'down')
    },
    rebalancePercent: function(index, direction) {
      //find available timeUser to modify
      while ((this.numActiveTimeUsers > 2 && this.timeUsersIterator === 1) ||
            this.timeUsers[this.timeUsersIterator].percent == 0 || index == this.timeUsersIterator ||
            this.timeUsersIterator <= 0) {
        this.timeUsersIterator++
        if (this.timeUsersIterator >= this.timeUsers.length) {
          this.timeUsersIterator = 0
        }
      }
      //change percentages
      if (direction == 'up') {
        this.timeUsers[index].percent++
        this.timeUsers[this.timeUsersIterator].percent--
      }
      else if (direction == 'down') {
        this.timeUsers[index].percent--
        this.timeUsers[this.timeUsersIterator].percent++
      }
      else {
        console.log("rebalancePercent error")
      }
      //prepare iterator for next use
      this.timeUsersIterator++
      if (this.timeUsersIterator >= this.timeUsers.length) {
        this.timeUsersIterator = 0
      }
    },
    changeMaxTime: function(amount, length) {
      if (amount < 0) {
        this.maxTime += amount
        for (var i = 0; i < Math.abs(amount); i++) {
          this.incrementPercent(this.timeOut.index)
        }
      }
      else {
        this.maxTime += amount
        this.values[0].percent += amount
        for (var i = 0; i < amount; i++) {
          this.decrementPercent(this.values[0].index)
        }
      }
      if (length != null) {
        this.timers.push({
          amount: amount,
          cb: () => {
            this.changeMaxTime(amount * -1, null)
          },
        })
      }
    },
    addCommodity: function(index, amount) {
      this.buildings[index].commodityAmount += amount
      if (this.buildings[index].commodityAmount >= this.buildings[index].commodityMax) {
        this.buildings[index].commodityAmount = this.buildings[index].commodityMax
      }
      //console.log(this.buildings[index].commodityAmount)
    },
    startTimer: function() {
      Timer.start(10)
    },
    stopTimer: function() {
      Timer.stop()
    },
    toggleTradeDialog: function() {
      this.tradeDialogConfig.message = ""
      if (this.tradeDialogConfig.showing == true) {
        this.tradeDialogConfig.width = 0
      }
      else {
        this.tradeDialogConfig.width = 250
      }
      this.tradeDialogConfig.showing = !this.tradeDialogConfig.showing
      //console.log("width: ", this.tradeDialogConfig.width)
    },
    toggleNotifications: function() {
      this.blankScreen('notify')
      if (this.notifyConfig.showing == true) {
        this.notifyConfig.width = 0
      }
      else {
        this.notifyConfig.width = 250
        this.newNotification = false
      }
      this.notifyConfig.showing = !this.notifyConfig.showing
    },
    gameOver: function() {
      this.endText.show = true
    },
    sendPacket: function(packet) {
      //console.log("Send Packet", this.wsHandler)
      PacketRegister.register(packet)
      this.wsHandler.send(JSON.stringify(packet))
    },
    registerUsername: function(user) {
      if (user == "") {
        alert("Invalid Username")
      }
      else {
        this.newNotification = true
        this.notifications.push({message: "You have been registered under the username " + user})
        this.sendPacket({
          type: 'register',
          id: this.user + this.uniqueId++,
          user: user,
          cb: (returnPacket) => {
            this.registerMessage = this.user + ' Registered'
            this.showRegisterDialog = false
            this.startTimer()
          },
        })
      }
    },
    fetchScores: function(index, current) {
      console.log("fetchScores")
      this.sendPacket({
        type: 'scores',
        id: this.user + this.uniqueId++,
        user: this.user,
        score: Math.floor(this.score),
        cb: (returnPacket) => {
          this.menuConfig[3].subMenu.splice(1, this.menuConfig[3].subMenu.length - 1) //changes the length
          for (var i = 0; i < returnPacket.scores.length; i++) {
            this.menuConfig[3].subMenu.push({
              name: returnPacket.scores[i],
              link: 0,
              method: 'none',
            })
          }
        },
      })
    },
    postOffer: function(offerType, acceptType, toTrade, amountOut, lengthOut, toAccept, amountIn, lengthIn,) {
      if (amountOut && !lengthOut) {  //trading commodities
        this.buildings[toTrade].commodityAmount -= amountOut
        this.buildings[toTrade].commodityReserved += amountOut
      }
      var tradeTitle = null
      var acceptTitle = null
      if (offerType === 'time') {
        tradeTitle = 'Time'
      }
      else if (offerType === 'capital') {
        tradeTitle = this.buildings[toTrade].title
      }
      else if (offerType === 'commodity') {
        tradeTitle = this.buildings[toTrade].commodityTitle
      }
      if (acceptType === 'time') {
        acceptTitle = 'Time'
      }
      else if (acceptType === 'capital') {
        acceptTitle = this.buildings[toAccept].title
      }
      else if (acceptType === 'commodity') {
        acceptTitle = this.buildings[toAccept].commodityTitle
      }
      this.sendPacket({
        type: 'offer',
        id: this.user + this.uniqueId++,
        user: this.user,
        offerType: offerType,
        acceptType: acceptType,
        tradeTitle: tradeTitle,
        acceptTitle: acceptTitle,
        toTrade: toTrade,
        amountOut: amountOut,
        lengthOut: lengthOut,
        toAccept: toAccept,
        amountIn: amountIn,
        lengthIn: lengthIn,
        cb: (returnPacket) => {
          console.log("New message: ", returnPacket.message)
          this.tradeDialogConfig.message = returnPacket.message
        },
      })
    },
    getOffers: function() {
      this.sendPacket({
        type: 'getOffers',
        id: this.user + this.uniqueId++,
        user: this.user,
        cb: (returnPacket) => {
          this.myOffers.splice(0, this.myOffers.length)
          this.otherOffers.splice(0, this.otherOffers.length)
          this.myOffers = returnPacket.myOffers
          this.otherOffers = returnPacket.otherOffers
        },
      })
    },
    acceptOffer: function(id) {
      this.sendPacket({
        type: 'acceptOffer',
        id: this.user + this.uniqueId++,
        user: this.user,
        offerToAccept: id,
        cb: (returnPacket) => {
          this.marketOptions.message = 'Offer Accepted'
          if (returnPacket.offer.offerType === 'capital') {
            this.addBuilding(returnPacket.offer.toTrade, null)
            this.buildings[returnPacket.offer.toTrade].built = true
          }
          else if (returnPacket.offer.offerType === 'commodity') {
            this.buildings[returnPacket.offer.toTrade].commodityAmount += returnPacket.offer.amountOut
          }
          if (returnPacket.offer.acceptType === 'capital') {
            this.removeBuilding(returnPacket.offer.toAccept)
          }
          else if (returnPacket.offer.acceptType === 'commodity') {
            this.buildings[returnPacket.offer.toAccept].commodityAmount -= returnPacket.offer.amountIn
          }
        },
      })
    },
    blankScreen: function(toClose) {
      if (this.screenIsBlank) {
        this.screenIsBlank = false
        this.dialogToClose = null
      }
      else {
        this.screenIsBlank = true
        this.dialogToClose = toClose
      }
    },
    blankClicked: function() {
      //console.log("clicked on blank", this.dialogToClose)
      if (this.dialogToClose === 'market') {
        this.toggleMarket()
        if (this.tradeDialogConfig.showing) {
          this.toggleTradeDialog()
        }
      }
      else if (this.dialogToClose === 'menu') {
        this.postMenu(null, 0)
      }
      else if (this.dialogToClose === 'notify') {
        this.toggleNotifications()
      }
    },
    recordScore: function() {
      this.sendPacket({
        type: 'recordScore',
        id: this.user + this.uniqueId++,
        user: this.user,
        score: Math.floor(this.score),
        cb: (returnPacket) => {},
      })
    },
    removeOffer: function(id) {
      this.sendPacket({
        type: 'removeOffer',
        id: this.user + this.uniqueId++,
        user: this.user,
        offer: id,
        cb: (returnPacket) => {
          this.marketOptions.message = 'Removed Offer'
          if (returnPacket.offerType === 'commodity') {
            this.buildings[returnPacket.offer.toTrade].commodityReserved -= returnPacket.offer.amountOut
            this.buildings[returnPacket.offer.toTrade].commodityAmount += returnPacket.offer.amountOut
          }
        }
      })
    },
  },
  watch: {
    x: function(val) {
    },
  },

  mounted: function () {
    //console.log("Window:", window.innerHeight, window.innerWidth),

    //adds values to timeUsers array
    this.$nextTick(function () {
      this.timeUsers.push(this.timeOut)
      for (var i = 0; i < this.values.length; i++) {
        if (this.values[i].arrows == true) {
          this.timeUsers.push(this.values[i])
        }
      }

      Timer.register('root', ()=>{
        if (this.timeCounter%50 === 0) { //twice every second
          if (this.timeCounter >= 30000) { //30000 = five minutes
            this.stopTimer()
            this.gameOver()
          }
        }
        if (this.timeCounter%100 === 0) { //once every second
          //change visible clock time
          this.currSeconds--
          if (this.currSeconds < 0) {
            this.currSeconds = 59
            this.currMinutes--
          }
          //console.log("Time: ", this.currMinutes + ":" + this.currSeconds)
          //counts trading timers
          for (var i = 0; i < this.timers.length; i++) {
            this.timers[i].amount--
            if (this.timers[i].amount <= 0) { //timer has finished counting
              this.timers[i].cb()
              this.timers.splice(i, 1)
            }
          }
        }
        if (this.timeCounter%300 === 0) { //once every three seconds
          this.recordScore()
        }
        this.timeCounter++
      })
    })

    let address = window.location.hostname
      , myId = localStorage.getItem('myId') || Uuidv1()
      , url = "ws://" + address + ":4001/" + myId
    localStorage.setItem('myId', myId)
    this.userId = myId
    this.wsHandler = new WebSocket(url)
    //console.log("Location: ", window.location.hostname, url)
    this.wsHandler.addEventListener('error', event => {
      //console.log("Error connecting")
    })
    this.wsHandler.addEventListener('close', event => {
      //console.log("Closed Socket")
    })
    this.wsHandler.addEventListener('open', event => {
      //console.log("Opened Socket")
      this.wsHandler.addEventListener('message', evt => {
        let pkt = JSON.parse(evt.data)
        //console.log("Got Message", pkt)
        PacketRegister.recieved(pkt)
      })
    })

  },
}

new Vue(Config)

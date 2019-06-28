//Tempus Valorem
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
// TODO:
//-
import Vue from 'vue'
Vue.config.productionTip = false

const Template = `
  <div class="tempus">
    <span class="open" @click="subMenu('main')">
      <img class="icon" :src="menuIcon" />
    </span>
    <button @click="startTimer"> Start Timer </button>
    <button @click="stopTimer"> Stop Timer </button>
    <!-- <tempus-menu v-on:sub-menu="subMenu" :config="config" :depth="depth"/> -->
    <!--<tempus-trade-menu :offers="offers"/>-->
    <button @click="addBuilding(0)"> Toggle Farm </button>
    <button @click="addBuilding(1)"> Toggle Factory </button>
    <span class="open" id="tradeButton">
      <img class="icon" src="icons/trading.png"/>
    </span>
    <svg class="tempus tempus-board" :viewBox="viewCoords">
      <path fill="none" stroke="blue" :d="svgOutline"> </path>
      <tempus-time x="1" y="1" size="50" @drag="doDrag"/>
      <tempus-building
      v-for="(building, index) in showingBuildings(buildings)"
      v-on:increment-percent="incrementPercent"
      v-on:decrement-percent="decrementPercent"
      v-on:add-commodity="addCommodity"
      v-on:toggle-trade-dialog="toggleTradeDialog"
      :build="building"
      :key="building.id"
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
      :key="value.title"
      :data="value"
      :config="valuesConfig"
      :index="index"
      />

    </svg>
    <tempus-trade-dialog :config="tradeDialogConfig" v-on:toggle-trade-dialog="toggleTradeDialog"/>
  </div>
`

import TempusTime from './time.vue'
import TempusMenu from './menu.vue'
import TempusBuilding from './building.vue'
import TempusValue from './value.vue'
import TempusTradeMenu from './tradeMenu.vue'
import TempusTradeDialog from './tradeDialog.vue'
var BuildingStartPos = 70
const Timer = require('./timer.js')

const Config = {
  el: '#app',
  template: Template,
  components: { 'tempus-time': TempusTime, 'tempus-menu': TempusMenu,
    'tempus-building': TempusBuilding, 'tempus-value': TempusValue,
    'tempus-trade-menu': TempusTradeMenu, 'tempus-trade-dialog': TempusTradeDialog},
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
    buildings: [
      {id: 0, title: 'Farm', commodityTitle: 'Food', commodityAmount: 0, commodityMax: 50, rate: 0.1, position: BuildingStartPos, showBuilding: false, percent: 0,},
      {id: 1, title: 'Factory', commodityTitle: 'Materials', commodityAmount: 0, commodityMax: 40, rate: 0.1, position: BuildingStartPos, showBuilding: false, percent: 0,},
    ],
    //menu props
    depth: 0,
    config: [
      {index:1, show: false, code: 'main', title: 'Menu', children:
        [{name: 'Buildings', code: 'build'},{name: 'Settings', code: 'set'},{name: 'Scores', code: 'score'},]},
      {index:2, show: false, code: 'build', title: 'Buildings', children: ['Farm', 'Factory',]}
    ],
    values: [
      {id:100, title: 'Idleness', timer: null, arrows: true, percent: 100,},
      {id:101, title: 'Health', timer: 100, arrows: true, percent: 0,},
      {id:102, title: 'Comfort', timer: null, arrows: true, percent: 0,},
      {id:103, title: 'Experiences', timer: null, arrows: true, percent: 0,},
      {id:104, title: 'Wealth', timer: null, arrows: false, percent: 0,},
    ],
    valuesConfig: {x: 15, y: 205, ry: 1.8, width: 45, height: 30,},
    val: {x: 10, y: 200, ry: 1.8, width: 255, height: 40,},
    offers: [
      {id:0, title: "JonahB", content: "50 Food"},
    ],
    tradeDialogConfig: {width: 0, showing: false,}
  }},
  computed: {
    width: function() {return this.maxX - this.minX},
    height: function() {return this.maxY - this.minY},
    viewHeight: function() {return this.width * this.viewAspect},
    viewBottom: function() {return this.minY + this.viewHeight},
    viewAspect: function() {let a = this.fullScreen; return window.innerHeight / window.innerWidth},
    viewCoords: function() {		//Viewport of SVG space
      console.log('Re-render:', this.minX, this.minY, this.width, this.viewBottom)
      //need to change return statement fourth parameter back to viewBottom
      return [this.minX, this.minY, this.width, this.height].join(' ')
    },
    svgOutline: function() {return `M ${this.minX}, ${this.minY} H ${this.maxX} V ${this.maxY} H ${this.minX} V ${this.minY} Z`},
  },
  methods: {
    xyz(n) {
      return null
    },
    doDrag(e) {
      console.log("Dragging:", e)
      //Insert code here to move item x,y location
    },
    subMenu(code) {
      for(var i = 0; i < config.length; i++) {
        if (code === config[i].code) {
          config[i].show = !config[i].show
        }
      }
    },
    addBuilding(index) {
      this.buildings[index].percent = 0
      //console.log(this.buildings[index].showBuilding)
      if (this.timeUsers.indexOf(this.buildings[index]) == -1) {
        this.timeUsers.push(this.buildings[index])
      }
      else {
        var i = this.timeUsers.indexOf(this.buildings[index])
        this.timeUsers.splice(i, 1)
      }
      this.buildings[index].showBuilding = !this.buildings[index].showBuilding
      //console.log(this.timeUsers.length)
    },
    showingBuildings: function(buildings) {
      return buildings.filter(function(building) {
        return building.showBuilding === true
      })
    },
    incrementPercent: function(id) {
      //find index
      var index = 0
      for (var i = 0; i < this.timeUsers.length; i++) {
        if (this.timeUsers[i].id == id) {
          index = i
          break
        }
      }
      //if percent already at 100
      if (this.timeUsers[index].percent == 100) {
        return
      }
      //if idleness has greater than 0 and not incrementing idleness, take from idleness
      if (this.timeUsers[0].percent != 0 && index != 0) {
        this.timeUsers[index].percent++
        this.timeUsers[0].percent--
        return
      }
      //if iterator needed
      this.rebalancePercent(index, 'up')
    },
    decrementPercent: function(id) {
      //find index
      var index = 0
      for (var i = 0; i < this.timeUsers.length; i++) {
        if (this.timeUsers[i].id == id) {
          index = i
          break
        }
      }
      //if percent already at 0
      if (this.timeUsers[index].percent == 0) {
        return
      }
      //if idleness is 100, add to Health
      if (this.timeUsers[0].percent == 100 && index == 0) {
        this.timeUsers[0].percent--
        this.timeUsers[1].percent++
        return
      }
      this.rebalancePercent(index, 'down')
    },
    rebalancePercent: function(index, direction) {
      //find available timeUser to modify
      while (this.timeUsers[this.timeUsersIterator].percent == 0 || index == this.timeUsersIterator) {
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
    addCommodity: function(id, amount) {
      this.buildings[id].commodityAmount += amount
      if (this.buildings[id].commodityAmount >= this.buildings[id].commodityMax) {
        this.buildings[id].commodityAmount = this.buildings[id].commodityMax
      }
      //console.log(this.buildings[id].commodityAmount)
    },
    startTimer: function() {
      Timer.start(10)
    },
    stopTimer: function() {
      Timer.stop()
    },
    toggleTradeDialog: function() {
      if (this.tradeDialogConfig.showing == true) {
        this.tradeDialogConfig.width = 0
      }
      else {
        this.tradeDialogConfig.width = 250
      }
      this.tradeDialogConfig.showing = !this.tradeDialogConfig.showing
      //console.log("width: ", this.tradeDialogConfig.width)
    },
  },
  watch: {
    x: function(val) {
    },
  },

  mounted: function () {
    console.log("Window:", window.innerHeight, window.innerWidth),

    //adds values to timeUsers array
    this.$nextTick(function () {
      var i = 0
      for (i = 0; i < this.values.length; i++) {
        if (this.values[i].arrows == true) {
          this.timeUsers.push(this.values[i])
        }
      }
    })
  },
}

new Vue(Config)

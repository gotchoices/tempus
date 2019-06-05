//Tempus Valorem
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
// TODO:
//-
import Vue from 'vue'
Vue.config.productionTip = false

const Template = `
  <div class="tempus">
    <tempus-menu v-on:addBuilding="addBuilding"/>
    <button @click="addBuilding(0)"> Show Farm </button>
    <button @click="addBuilding(1)"> Show Factory </button>
    <svg class="tempus tempus-board" :viewBox="viewCoords">
      <path fill="none" stroke="blue" :d="svgOutline"> </path>
      <tempus-time x="1" y="1" size="50" @drag="doDrag"/>
      <tempus-building
      v-for="(building, index) in showingBuildings(buildings)"
      :key="building.id"
      :title="building.title"
      :position="building.position + (index * 70)"
      :commodityTitle="building.commodityTitle"
      :showBuilding="building.showBuilding"
      />
    <tempus-values/>
    </svg>
  </div>
`

import TempusTime from './time.vue'
import TempusMenu from './menu.vue'
import TempusBuilding from './building.vue'
import TempusValues from './values.vue'
var BuildingStartPos = 70

const Config = {
  el: '#app',
  template: Template,
  components: { 'tempus-time': TempusTime, 'tempus-menu': TempusMenu, 'tempus-building': TempusBuilding, 'tempus-values': TempusValues,},
  data() { return {
    minX:	0,
    minY:	0,
    maxX:	300,
    maxY:	300,
    showFarm: false,
    showFactory: false,
    buildings: [
      {id: 0, title: 'Farm', commodityTitle: 'Food', position: BuildingStartPos, showBuilding: false,},
      {id: 1, title: 'Factory', commodityTitle: 'Materials', position: BuildingStartPos, showBuilding: false,},
    ],
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
    addBuilding(index) {
      this.buildings[index].showBuilding = !this.buildings[index].showBuilding
    },
    showingBuildings: function(buildings) {
      return buildings.filter(function(building) {
        return building.showBuilding === true
      })
    },
  },
  watch: {
    x: function(val) {
    },
  },

  mounted: function () {
console.log("Window:", window.innerHeight, window.innerWidth)
  },
}

new Vue(Config)

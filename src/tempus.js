//Tempus Valorem
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
// TODO:
//- 
import Vue from 'vue'
Vue.config.productionTip = false

const Template = `
  <div class="tempus">
    <tempus-menu/>
    <svg class="tempus tempus-board" :viewBox="viewCoords">
      <tempus-time x="10" y="10" size="100" @drag="doDrag"/>
    </svg>
  </div>
`
//    <tempus-cap/>

import TempusTime from './time.vue'
import TempusMenu from './menu.vue'

const Config = {
  el: '#app',
  template: Template,
  components: { 'tempus-time': TempusTime, 'tempus-menu': TempusMenu},
  data() { return {
    minX:	0,
    minY:	0,
    maxX:	300,
    maxY:	400,
  }},
  computed: {
    width: function() {return this.maxX - this.minX},
    height: function() {return this.maxY - this.minY},
    viewHeight: function() {return this.width * this.viewAspect},
    viewBottom: function() {return this.minY + this.viewHeight},
    viewAspect: function() {let a = this.fullScreen; return window.innerHeight / window.innerWidth},
    viewCoords: function() {		//Viewport of SVG space
console.log('Re-render:', this.minX, this.minY, this.width, this.viewBottom)
      return [this.minX, this.minY, this.width, this.viewBottom].join(' ')
    },
  },
  methods: {
    xyz(n) {
      return null
    },
    doDrag(e) {
console.log("Dragging:", e)
      //Insert code here to move item x,y location
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

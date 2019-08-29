//Tempus Valorem - Capital Row
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="building" >

    <defs>  <!--This is for loading buildings -->
      <clipPath :id="buildingBuffer">
        <rect :x="x" :y="y" :width="boxWidth" :height="boxHeight" ry="1.8" />
      </clipPath>
    </defs>

    <text class="percentage" :x="x + 1" :y="y - 1" fill="black" font-size="5px"> {{build.percent}}% </text>
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="x"
    :y="y"
    ry="1.8"
    />
    <rect :x="x" :y="bufferPos" :width="boxWidth" :height="boxHeight"
      fill="#36567d" :clip-path=url ></rect>
    <path class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="upArrow"
      @mousedown="mouseDown(build.index, 'up')" @mouseup="mouseUp(build.index, 'up')"
      @mouseleave="mouseUp(build.index, 'up')"/>
    <path class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="downArrow"
    @mousedown="mouseDown(build.index, 'down')" @mouseup="mouseUp(build.index, 'down')"
    @mouseleave="mouseUp(build.index, 'down')"/>
    <text :x="x + 2" :y="y + 15" fill="black" font-size="7px"> {{build.title}} </text>
    <path fill="none" stroke="black" :d="connectingLine" />
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="x"
    :y="y + 60"
    ry="1.7936023"
    />
    <text :x="x + 2" :y="y + 70" fill="black" font-size="7px"> {{build.commodityTitle}} </text>
    <text :x="x + 6" :y="y + 78" fill="black" font-size="7px"> {{displayAmount}} / {{build.commodityMax}}
      </text>


  </g>

</template>

<script>

const Timer = require('./timer.js')

export default {
  name: 'tempus-building',
  props: ['build', 'index',],
  data() { return {
    y: 70,
    boxHeight: 30,
    boxWidth: 30,
    timeCounter: 0,
    currTime: this.build.buildTime,
    startTimer: null,
    repeatTimer: null,
    startTime: 500,
    repeatTime: 200,
  }},
  computed: {
    bufferPos: function () {
      return (this.y) + ((this.build.buildTime - this.currTime) * (this.boxHeight / this.build.buildTime))
    },
    displayAmount: function() {return Math.floor(this.build.commodityAmount)},
    x: function() {return this.build.position + this.index * 50},
    connectingLine: function() {return `M ${this.x + (this.boxWidth / 2)}, ${this.y + this.boxHeight}
     V ${this.y + this.boxHeight + (this.boxHeight)} Z`},
    upArrow: function() {return `M ${this.x + this.boxWidth*(2/3)}, ${this.y + this.boxHeight/5}
     H ${this.x + this.boxWidth*(9/10)}
     L ${this.x + this.boxWidth*(47/60)}, ${this.y + this.boxHeight*(1/15)} Z`},
    downArrow: function() {return `M ${this.x + this.boxWidth*(2/3)}, ${this.y + this.boxHeight*(4/5)}
     H ${this.x + this.boxWidth*(9/10)}
     L ${this.x + this.boxWidth*(47/60)}, ${this.y + this.boxHeight - this.boxHeight*(1/15)} Z`},
    buildingBuffer: function() {return "buffer" + this.index},
    url: function() {return "url(#" + this.buildingBuffer + ")"},
  },

  methods: {
    everyTick() {
      if (this.build.owned == true) {
        if (this.build.built == false) {
          if (this.currTime > 0) {
            this.currTime -= (this.build.percent / 100) * this.build.buildTime / 20
          }
          else {
            this.currTime = 0
            this.build.built = true
          }
        }
        else {
          var amountAdded = this.build.percent * this.build.rate
          this.$emit('add-commodity', this.build.index, amountAdded)
        }
      }
    },
    incrementPercent: function(index) {
      //console.log('up: ' + index)
      this.$emit('increment-percent', index)
    },
    decrementPercent: function(index) {
      //console.log('down')
      this.$emit('decrement-percent', index)
    },
    mouseDown: function(index, direction) { //repeats if held down
      //console.log('Pressed down')
      if (this.startTimer) clearTimeout(this.startTimer)
      if (this.repeatTimer) clearInterval(this.repeatTimer)
      this.startTimer = setTimeout(() => {	//After initial timeout
        this.startTimer = null
        //Start repeating more rapidly
        if (direction === 'up') {
          this.repeatTimer = setInterval(this.incrementPercent, this.repeatTime, index)
        }
        else if (direction === 'down') {
          this.repeatTimer = setInterval(this.decrementPercent, this.repeatTime, index)
        }
        else {
          //console.log("error with direction")
        }
      }, this.startTime)
    },
    mouseUp: function(index, direction) {
      //console.log("Lifted Up")
      if (this.startTimer) {			//If waiting for button to repeat
        clearTimeout(this.startTimer)		//Cancel that
        this.startTimer = null
        if (direction === 'up') {
          this.incrementPercent(index) //increment once
        }
        else {
          this.decrementPercent(index) //decrement once
        }
      }
      if (this.repeatTimer) {			//If we have already been repeating
        //console.log('was repeating')
        clearInterval(this.repeatTimer)		//Just quit
        this.repeatTimer = null
      }
    },
  },

  mounted: function() {
    Timer.register(this.build.title + "_" + this._uid, ()=>{
      if (this.timeCounter%50 === 0) { //twice every second

        this.everyTick()
      }
      this.timeCounter++
    })
  }
}

</script>

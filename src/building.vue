//Tempus Valorem - Capital Row
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="building" >

    <defs>  <!--This is for loading buildings -->
      <clipPath id="buildingBuffer">
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
      fill="#36567d" clip-path="url(#buildingBuffer)" ></rect>
    <path class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="upArrow"
      @click="$emit('increment-percent', build.index)"/>
    <path class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="downArrow"
      @click="$emit('decrement-percent', build.index)"/>
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

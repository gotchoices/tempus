//Tempus Valorem - Value Component
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="value">

    <defs>  <!--This is for any value that needs a timer -->
      <clipPath id="healthClip">
        <rect :x="config.x + 50" :y="config.y" width="45" height="30"
        :ry="config.ry" />
      </clipPath>
    </defs>

    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
      :x="config.x + (index * 50)"
      :y="config.y"
      :width="config.width"
      :height="config.height"
      :ry="config.ry"
      >
    </rect>
    <rect v-if="data.timer != null" class="valueSands" :x="config.x + 50" :y="sandPos" width="45" height="30" fill="#F7E0B7" clip-path="url(#healthClip)" ></rect>
    <text class="valueText" :x="config.x + (index * 50) + 2" y="211" fill="black" font-size="6px"> {{data.title}} </text>
    <text v-if="data.arrows" class="percentage" :x="config.x + config.width*(2/3) + index*(50) + 2" :y="config.y + config.height/2 + 1" fill="black" font-size="5px"> {{data.percent}}% </text>
    <path v-if="data.arrows" class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="upArrow" @click="$emit('increment-percent', data.index)"/>
    <path v-if="data.arrows" class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="downArrow" @click="$emit('decrement-percent', data.index)"/>
  </g>

</template>

<script>

import	Interact from 'interactjs'
const Timer = require('./timer.js')

export default {
  name: 'tempus-value',
  props: ['config', 'data', 'index'],
  data() { return {
    timer: null,
    startTime: 500,
    curTime: 500,
    timeCounter: 0,
    totalScore: 0,
    reducer: 0.0001
  }},
  computed: {
    sandPos: function () {
      return (this.config.y) + ((this.startTime - this.curTime) * (230 - this.config.y) / 100)
    },
    upArrow: function() {return `M ${this.config.x + this.config.width*(3/4) + this.index*(50)}, ${this.config.y + this.config.height/5}
     H ${this.config.x + this.config.width*(19/20) + this.index*(50)}
     L ${this.config.x + this.config.width*(17/20) + this.index*(50)}, ${this.config.y + this.config.height*(1/15)} Z`},
    downArrow: function() {return `M ${this.config.x + this.config.width*(3/4) + this.index*(50)}, ${this.config.y + this.config.height*(4/5)}
     H ${this.config.x + this.config.width*(19/20) + this.index*(50)}
     L ${this.config.x + this.config.width*(17/20) + this.index*(50)}, ${this.config.y + this.config.height - this.config.height*(1/15)} Z`},
  },

  methods: {
    everyTick() {
      var newScore = this.data.percent * this.data.mltplr * this.reducer
      if (this.data.scale > 0) {
        this.totalScore = this.totalScore*1 + newScore
      }
      else {
        this.totalScore = newScore
      }
      this.$emit('update-score', this.totalScore)
    }
  },

  mounted: function() {
    if (this.data.arrows == true) {
      Timer.register(this.data.title + "_" + this._uid, ()=>{
        if (this.timeCounter%100 === 0) { //once every second
          this.curTime -= 1
          //console.log('curTime:', this.curTime)
        }
        this.timeCounter++
        if (this.curTime <= 0) Timer.register('health')
        this.everyTick()
      })
    }
  }
}

</script>

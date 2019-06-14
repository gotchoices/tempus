//Tempus Valorem - Value Component
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="value">

    <defs>  <!--This is for any value that needs a timer -->
      <clipPath id="healthClip">
        <rect :x="config.x + 55" :y="config.y + 5" width="45" height="30"
        :ry="config.ry" />
      </clipPath>
    </defs>

    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
      :x="config.x + 5 + (data.id * 50)"
      :y="config.y + 5"
      width="45"
      height="30"
      :ry="config.ry"
      >
    </rect>
    <rect class="valueSands" :x="config.x + 55" :y="sandPos" width="45" height="30" fill="#F7E0B7" clip-path="url(#healthClip)" ></rect>
    <text class="valueText" :x="config.x + (data.id * 50) + 8" y="215" fill="black" font-size="8px"> {{data.title}} </text>
  </g>

</template>

<script>

import	Interact from 'interactjs'
const Timer = require('./timer.js')

export default {
  name: 'tempus-value',
  props: ['config', 'data'],
  data() { return {
    timer: null,
    startTime: 500,
    curTime: 500,
    timeCounter: 0,
  }},
  computed: {
    sandPos: function () {
      return (this.newY) + ((this.startTime - this.curTime) * (230 - this.newY) / 100)
    },
    newY: function() {
      return this.config.y + 5
    }
  },

  methods: {
  },

  mounted: function() {
    Timer.register(this.config.title + "_" + this._uid, ()=>{
      if (this.timeCounter%100 === 0) { //once every second
        this.curTime -= 1
        //console.log('curTime:', this.curTime)
      }
      this.timeCounter++
      if (this.curTime <= 0) Timer.register('health')
    })
  }
}

</script>

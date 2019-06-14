//Tempus Valorem - Game Timer
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

// SVG code borrowed from: https://codepen.io/chrisgannon/pen/bdaXMQ/
<template>
  <g class="tempus-time" :transform="transform">

    <defs>
      <clipPath id="topMask">
        <path class="topMask" fill="#6D00BF" d="M316.7,266.3c-0.2,0.1-3.7,1.5-4.8,2.5c0,0,0,0,0,0.1c-1.8,1.5-3.2,4.5-3.2,7.1l-1.6,0l-1.4,0c0-2.6-1.4-5.6-3.2-7.1c0,0,0-0.1,0-0.1c-1.1-1-4.6-2.5-4.8-2.5C237.1,249.5,195,174,188,91h119h119.3C419.3,174,377.2,249.5,316.7,266.3z"/>
      </clipPath>
    </defs>

    <rect class="background" x="0" y="0" width="600" height="600"/>
    <g clip-path="url(#topMask)">
      <rect class="topSand" x="0" :y="sandPos" fill="#F7E0B7" width="600" height="185"/>
    </g>

    <rect class="top" x="175" y="70" fill="#F1AF31" width="263" height="21"/>
    <line class="drip" fill="none" stroke="#F7E0B7" stroke-width="2" stroke-miterlimit="10" x1="307" y1="275" x2="307" y2="460"/>
    <path class="body" opacity="0.23" fill="#FFFFFF" d="M432.2,459 H180.8 c4.3-90,49.8-165,108.7-175.2 c6.1-1,10.3-5.2,10.3-8.8 c0-3-4.2-7.8-10.3-8.8 C230.6,256,185.2,180.5,180.8,91h251.3 c-4.3,89.6-49.7,166.3-108.8,175.2 c-6,0.9-10.2,6.1-10.2,8.8 c0,2.7,4.3,7.9,10.2,8.8 C382.5,292.7,427.8,369,432.2,459z"/>

    <path class="topShadow" fill="#121212" opacity="0.12" d="M432.5,91h-252c0.3,4.1,0.8,8.8,1.4,14h249.3C432,98.3,432.2,95,432.5,91z"/>
    <path class="rightShine" opacity="0.10" fill="#FFFFFF" d="M316.6,283.8c-5.2-1.2-8-6.1-8-8.8c0-2.7,2.8-7.5,8-8.8c58.6-14,105.6-87,106.5-175.2h-22.8c-3.6,85.6-38.3,168.8-102.8,177.2c0,0,8,0.7,8,6.8c0,6.2-8,6.8-8,6.8c64.5,8.3,99.2,91.6,102.8,177.2h22.8C422.3,370.8,375.3,297.8,316.6,283.8z"/>
    <path class="leftShine" opacity="0.28" fill="#FFFFFF" d="M 297,283.8 c 5.2,-1.2,8,-6.1,8,-8.8 c0-2.7-2.8-7.5-8-8.8 c-58.6-14-105.6-87-106.5-175.2h22.8 c3.6,85.6,38.3,168.8,102.8,177.2 c0,0-8,0.7-8,6.8 c0,6.2,8,6.8,8,6.8 c-64.5,8.3-99.2,91.6-102.8,177.2 h-22.8 C191.4,370.8,238.4,297.8,297,283.8 z"/>

    <rect class="bottom" x="175" y="459" fill="#F1AF31" width="263" height="21"/>

  </g>
</template>

<script>
import	Interact from 'interactjs'
const Timer = require('./timer.js')
const	NativeSVG = 600					//Original SVG size

export default {
  name: 'tempus-time',
  props: {
//    state:	{type: Object, default: () => ({})},
    x:		{default: 0},
    y:		{default: 0},
    size:	{default: 50},
    startTime:	{default: 500},
  },
  data() { return {
    drag:	false,
    rotate:	0,
    xScale:	this.size / NativeSVG,
    yScale:	this.size / NativeSVG,
    curTime:	this.startTime,
    timer:	null,
    timeCounter: 0,
  }},
  computed: {
    transform: function() {				//Moves the object around when we change x or y
      return `translate(${this.x}, ${this.y}) rotate(${this.rotate}) scale(${this.xScale}, ${this.yScale})`
    },
    objStyle: function () {return {			//Change the cursor to show our object as movable
      cursor:		this.drag ? 'move' : 'arrow',
    }},
    sandPos: function () {
      return 90 + ((this.startTime - this.curTime) * (265-90) / 100)
    },
  },

  methods: {
  },

  beforeMount: function() {
console.log("Scale:", this.xScale, this.yScale)
  },

  mounted: function() {
    //console.log("Node Mount:", this.state)
    Interact(this.$el).draggable({
      inertia: true,
      onmove: event => {this.$emit('drag', event)}
    })
    Timer.register("time_" + this._uid,()=>{
      if (this.timeCounter%100 === 0) { //once every second
        this.curTime -= 1
        //console.log('curTime:', this.curTime)
      }
      this.timeCounter++
      if (this.curTime <= 0) Timer.register('hourglass')
    })
  }
}

</script>

<style lang="less">
  .background {
    fill: #4873A9;
  }
</style>

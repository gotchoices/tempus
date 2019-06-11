//Tempus Valorem - Values Bar
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="values">

    <defs>
      <clipPath id="healthClip">
        <rect :x="x + 55" :y="y + 5" width="45" height="30"/>
      </clipPath>
    </defs>

    <rect style="fill:#b8cae0;fill-opacity:1;stroke-width:0.26458332"
    :width="width"
    :height="height"
    :x="x"
    :y="y"
    :ry="ry"
    />
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
      v-for="(item, index) in values"
      :x="x + 5 + (index * 50)"
      :y="y + 5"
      width="45"
      height="30"
      :ry="ry"
      >
    </rect>
    <rect :x="x + 55" :y="sandPos" width="45" height="30" fill="#F7E0B7" clip-path="url(#healthClip)" ></rect>
    <text v-for="item, index) in values" :x="x + (index * 50) + 8" y="215" fill="black" font-size="8px"> {{item}} </text>
  </g>

</template>

<script>

import	Interact from 'interactjs'

export default {
  name: 'tempus-values',
  props: ['width', 'height', 'x', 'y', 'ry',],
  data() { return {
    values: ['Idleness', 'Health', 'Comfort', 'Experiences', 'Wealth',],
    timer: null,
    startTime: 500,
    curTime: 500,
  }},
  computed: {
    sandPos: function () {
      return (this.newY) + ((this.startTime - this.curTime) * (230 - this.newY / 100))
    },
    newY: function() {
      return this.y + 5
    }
  },

  methods: {
  },

  mounted: function() {
    this.timer = setInterval(() => {		//Animate the hourglass
      //console.log("Interval:", this.curTime)
      this.curTime -= 1
      if (this.curTime <= 0) clearInterval(this.timer)
    }, 500)
  }
}

</script>

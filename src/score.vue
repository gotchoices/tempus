//Tempus Valorem - Scores Component
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------

<template>

  <g class="score">
    <text x="60" y="15" font-size="10"> {{user}}'s score: {{this.displayScore}} </text>
  </g>

</template>

<script>

import	Interact from 'interactjs'
const Timer = require('./timer.js')

export default {
  name: 'tempus-score',
  props: ['score', 'user'],
  data() { return {
    timeCounter: 0,
    displayScore: 0,
  }},
  computed: {
    roundScore: function() {return Math.floor(this.score)},
  },

  methods: {

  },

  mounted: function() {
    Timer.register("score", ()=>{
      if (this.timeCounter%100 === 0) { //once every second
        this.displayScore = this.roundScore
      }
      this.timeCounter++
    })
  }
}

</script>

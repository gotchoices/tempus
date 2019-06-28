//Tempus Valorem - Trading Menu
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>
  <div>
    <div class="tradeMenu">
      <div class="tradeMenuDivider top">
        <h2 class="dividerHeading"> My Offers </h2>
        <div class="offer" v-for="(offer, index) in offers">
          <text class="offer title"> {{offers[index].title}} </text>
          <text class="offer content"> {{offers[index].content}} </text>
        </div>
      </div>
      <div class="tradeMenuDivider bottom">
        <h2 class="dividerHeading bottom"> Other Offers </h2>
      </div>
  </div>
</div>

</template>

<script>

import	Interact from 'interactjs'
const Timer = require('./timer.js')

export default {
  name: 'tempus-trade-menu',
  props: ['offers'],
  data() { return {
  }},
  computed: {
  },

  methods: {
  },

  mounted: function() {
  }
}

</script>

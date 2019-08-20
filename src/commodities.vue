//Tempus Valorem - Commodities Component
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------

<template>
  <div class="commoditiesBox">
    <p> Available Time: {{maxTime}} </p>
    <span v-for="commodity in buildings">
      <p>{{commodity.commodityTitle}}: {{Math.floor(commodity.commodityAmount)}} ({{commodity.commodityReserved}})</p>
    </span>
  </div>
</template>

<script>

import	Interact from 'interactjs'
const Timer = require('./timer.js')

export default {
  name: 'tempus-commodities',
  props: ['buildings', 'maxTime',],
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

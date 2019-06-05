//Tempus Valorem - Capital Row
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="building" v-show="showBuilding">
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="position"
    :y="y"
    ry="1.7936023"
    />
    <text :x="position + 5" :y="y + 10" fill="black" font-size="10px"> {{title}} </text>
    <path fill="none" stroke="black" :d="connectingLine" />
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="position"
    :y="y + 60"
    ry="1.7936023"
    />
    <text :x="position + 5" :y="y + 70" fill="black" font-size="10px"> {{commodityTitle}} </text>
  </g>

</template>

<script>

export default {
  name: 'tempus-building',
  props: ['title', 'position', 'commodityTitle', 'showBuilding'],
  data() { return {
    y: 70,
    boxHeight: 40,
    boxWidth: 40,
  }},
  computed: {
    connectingLine: function() {return `M ${this.position + 20}, ${this.y + this.boxHeight} V ${this.y + this.boxHeight + 20} Z`}
  },

  methods: {
  },
}

</script>

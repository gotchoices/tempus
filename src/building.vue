//Tempus Valorem - Capital Row
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="building" v-show="showBuilding">
    <path fill="black" stroke="black" stroke-width:1 :d="upArrow" />
    <path fill="black" stroke="black" stroke-width:1 :d="downArrow" />
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="position"
    :y="y"
    ry="1.8"
    />
    <text :x="position + 2" :y="y + 10" fill="black" font-size="7px"> {{title}} </text>
    <path fill="none" stroke="black" :d="connectingLine" />
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="position"
    :y="y + 60"
    ry="1.7936023"
    />
    <text :x="position + 2" :y="y + 70" fill="black" font-size="7px"> {{commodityTitle}} </text>
  </g>

</template>

<script>

export default {
  name: 'tempus-building',
  props: ['title', 'position', 'commodityTitle', 'showBuilding'],
  data() { return {
    y: 70,
    boxHeight: 30,
    boxWidth: 30,
  }},
  computed: {
    connectingLine: function() {return `M ${this.position + (this.boxWidth / 2)}, ${this.y + this.boxHeight}
     V ${this.y + this.boxHeight + (this.boxHeight)} Z`},
    upArrow: function() {return `M ${this.position + this.boxWidth/2 + this.boxWidth*(1/16)}, ${this.y - this.boxHeight/20}
     H ${this.position + this.boxWidth/2 + this.boxWidth*(3/16)}
     L ${this.position + this.boxWidth/2 + this.boxWidth*(2/16)}, ${this.y - this.boxHeight/20 - this.boxWidth*(1/16)} Z`},
    downArrow: function() {return `M ${this.position + this.boxWidth/2 + this.boxWidth*(5/16)}, ${this.y - this.boxHeight/20}
     L ${this.position + this.boxWidth/2 + this.boxWidth*(6/16)}, ${this.y - this.boxHeight/20 - this.boxWidth*(1/16)}
     H ${this.position + this.boxWidth/2 + this.boxWidth*(4/16)} Z`}
  },

  methods: {
  },
}

</script>

//Tempus Valorem - Capital Row
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>

  <g class="building" v-show="showBuilding">
    <text class="percentage" :x="position + 1" :y="y - 1" fill="black" font-size="5px"> {{percent}}% </text>
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="position"
    :y="y"
    ry="1.8"
    />
    <path class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="upArrow" @click="$emit('increment-percent', id)"/>
    <path class="percentArrow" fill="black" stroke="black" stroke-width:1 :d="downArrow" @click="$emit('decrement-percent', id)"/>
    <text :x="position + 2" :y="y + 15" fill="black" font-size="7px"> {{title}} </text>
    <path fill="none" stroke="black" :d="connectingLine" />
    <rect style="fill:#94afd1;fill-opacity:1;stroke-width:0.26458332"
    :width="boxWidth"
    :height="boxHeight"
    :x="position"
    :y="y + 60"
    ry="1.7936023"
    />
    <text :x="position + 2" :y="y + 70" fill="black" font-size="7px"> {{commodityTitle}} </text>
    <text :x="position + 10" :y="y + 80" fill="black" font-size="7px"> {{commodityAmount}} / {{commodityMax}} </text>
  </g>

</template>

<script>

export default {
  name: 'tempus-building',
  props: ['title', 'position', 'commodityTitle', 'commodityAmount', 'commodityMax', 'showBuilding', 'id', 'percent',],
  data() { return {
    y: 70,
    boxHeight: 30,
    boxWidth: 30,
  }},
  computed: {
    connectingLine: function() {return `M ${this.position + (this.boxWidth / 2)}, ${this.y + this.boxHeight}
     V ${this.y + this.boxHeight + (this.boxHeight)} Z`},
    upArrow: function() {return `M ${this.position + this.boxWidth*(2/3)}, ${this.y + this.boxHeight/5}
     H ${this.position + this.boxWidth*(9/10)}
     L ${this.position + this.boxWidth*(47/60)}, ${this.y + this.boxHeight*(1/15)} Z`},
    downArrow: function() {return `M ${this.position + this.boxWidth*(2/3)}, ${this.y + this.boxHeight*(4/5)}
     H ${this.position + this.boxWidth*(9/10)}
     L ${this.position + this.boxWidth*(47/60)}, ${this.y + this.boxHeight - this.boxHeight*(1/15)} Z`},
  },

  methods: {
  },
}

</script>

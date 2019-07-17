//Tempus Valorem - Trading Dialog
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>
<div>
  <div id="tradeDialog" class="sidenav rightMenu" :style="'width: ' + config.width + 'px'">
    <span>
      <img class="icon closebtn" :src="backIcon" @click="closeDialog"/>
    </span>
    <h2> Trade Dialog </h2>
    <!-- Capital -->
    <select v-model="capital">
      <option disabled value=null> Capital </option>
      <option v-for="building in buildings" :value="building.title">
        {{building.title}}
      </option>
    </select>
    <br>
    <!-- Commodities -->
    <select v-model="commodity">
      <option disabled value=null> Commodities </option>
      <option v-for="building in buildings" :value="building.commodityTitle">
        {{building.commodityTitle}}
      </option>
    </select>
    <input v-if="commodity" v-model.number="amount" placeholder="Amount to trade"></input>
    <br>
    <button @click="postOffer"> Post Offer </button>
    <button @click="clear"> Clear </button>
    <p> {{config.message}} </p>
  </div>

</div>
</template>

<script>

export default {
  name: 'tempus-trade-dialog',
  props: ['config', 'buildings'],
  data() { return {
    backIcon: 'icons/close.png',
    capital: null,
    commodity: null,
    amount: null,
    showAmount: false,
  }},
  computed: {
  },
  methods: {
    postOffer: function() {
      //console.log("type: ", typeof this.amount)
      if (this.capital === null && this.commodity === null) {
        this.config.message = 'Empty Selection, please select what you would like to trade'
      }
      else if (this.capital != null && this.commodity != null) {
        this.config.message = 'Please only select one thing to trade'
      }
      else if (this.commodity != null && this.amount === null) {
        this.config.message = 'Please enter an amount'
      }
      else if (this.commodity != null && (typeof this.amount) === 'string') {
        this.config.message = 'Invalid amount, please input a number'
        //console.log("Invalid type")
      }
      else if (this.capital != null && this.amount != null) {
        this.amount = null
      }
      else {
        this.$emit('post-offer', this.selected, this.amount)
      }
    },
    clear: function() {
      this.commodity = null
      this.capital = null
      this.amount = null
      this.config.message = ""
    },
    closeDialog: function() {
      //console.log("closeDialog")
      this.clear()
      this.$emit('toggle-trade-dialog')
    },
  },
}

</script>

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

    <p>Offering:</p>
    <!-- Capital -->
    <select v-model="capitalOut">
      <option disabled value=null> Capital </option>
      <option v-if="building.built" v-for="building in buildings" :value="building.index">
        {{building.title}}
      </option>
    </select>
    <br>
    <!-- Commodities -->
    <select v-model="commodityOut">
      <option disabled value=null> Commodities </option>
      <option v-for="building in buildings" :value="building.index">
        {{building.commodityTitle}}
      </option>
    </select>
    <input v-if="(commodityOut != null)" v-model.number="amountOut" placeholder="Amount to trade"></input>
    <br>

    <p>Accepting</p>
    <!-- Capital -->
    <select v-model="capitalIn">
      <option disabled value=null> Capital </option>
      <option v-for="building in allBuildings" :value="building.index">
        {{building.title}}
      </option>
    </select>
    <br>
    <!-- Commodities -->
    <select v-model="commodityIn">
      <option disabled value=null> Commodities </option>
      <option v-for="building in allBuildings" :value="building.index">
        {{building.commodityTitle}}
      </option>
    </select>
    <input v-if="(commodityIn != null)" v-model.number="amountIn" placeholder="Amount to receive"></input>
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
  props: ['config', 'buildings', 'allBuildings'],
  data() { return {
    backIcon: 'icons/close.png',
    capitalOut: null,
    commodityOut: null,
    amountOut: null,
    showAmountOut: false,
    capitalIn: null,
    commodityIn: null,
    amountIn: null,
    showAmountIn: false,
  }},
  computed: {
  },
  methods: {
    postOffer: function() {
      //console.log("type: ", typeof this.amount)

      if (this.capitalOut === null && this.commodityOut === null) {
        this.config.message = 'Empty Selection, please select what you would like to trade'
      }
      else if (this.capitalOut != null && this.capitalOut.built == false) {
        this.config.message = 'Cannot trade an unfinished building'
      }
      else if (this.capitalOut != null && this.commodityOut != null) {
        this.config.message = 'Please only select one thing to trade'
      }
      else if (this.commodityOut != null && this.amountOut === null) {
        this.config.message = 'Please enter an amount to trade'
      }
      else if (this.commodityOut != null && (typeof this.amountOut) === 'string') {
        this.config.message = 'Invalid trading amount, please input a number'
        //console.log("Invalid type")
      }
      else if (this.capitalOut != null && this.amountOut != null) {
        this.amountOut = null
      }
      else if (this.capitalIn === null && (this.commodityIn === null && this.amountIn === null)) {
        this.config.message = 'Empty Selection, please select what you will accept'
      }
      else if (this.capitalIn != null && this.commodityIn != null) {
        this.config.message = 'Please only select one thing to accept'
      }
      else if (this.commodityIn != null && this.amountIn === null) {
        this.config.message = 'Please enter an amount to accept'
      }
      else if (this.commodityIn != null && (typeof this.amountIn) === 'string') {
        this.config.message = 'Invalid accepting amount, please input a number'
      }
      else if (this.capitalOut != null) {
        if (this.capitalIn === null) {
          this.$emit('post-offer', 'capital', 'commodity', this.capitalOut, null, this.commodityIn, this.amountIn,)
        }
        else {
          this.$emit('post-offer', 'capital', 'capital', this.capitalOut, null, this.capitalIn, null,)
        }
      }
      else if (this.commodityOut != null) {
        if (this.allBuildings[this.commodityOut].commodityAmount < this.amountOut) {
          this.config.message = 'Amount is greater than amount owned, please enter a lower amount'
        }
        else {
          if (this.capitalIn === null) {
            this.$emit('post-offer', 'commodity', 'commodity', this.commodityOut, this.amountOut, this.commodityIn, this.amountIn,)
          }
          else {
            this.$emit('post-offer', 'commodity', 'capital', this.commodityOut, this.amountOut, this.capitalIn, null,)
          }
        }
      }
    },
    clear: function() {
      this.commodityOut = null
      this.capitalOut = null
      this.amountOut = null
      this.commodityIn = null
      this.capitalIn = null
      this.amountIn = null
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

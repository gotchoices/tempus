//Tempus Valorem - Trading Menu/Market
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>
  <div>
    <div class="market" :style="'width: ' + options.width + 'px'">
      <span>
        <img class="icon closebtn" :src="backIcon" @click="closeMarket"/>
      </span>
      <button @click="newOffer">New Offer</button>
      <p> {{options.message}} </p>
      <div class="marketDivider top">
        <h2 class="dividerHeading"> My Offers </h2>
        <div class="offer" v-for="(offer, index) in myOffers">
          <p> Offering: {{offer.tradeTitle}} </p>
          <p v-if="offer.amountOut"> Amount: {{offer.amountOut}} </p>
          <p> Accepting: {{offer.acceptTitle}} </p>
          <p v-if="offer.amountIn"> Amount: {{offer.amountIn}} </p>
        </div>
      </div>
      <div class="marketDivider bottom">
        <h2 class="dividerHeading bottom"> Other Offers </h2>
        <div class="offer" v-for="(offer, index) in otherOffers">
          <p> Name: {{offer.user}} </p>
          <p> Offering: {{offer.tradeTitle}} </p>
          <p v-if="offer.amountOut"> Amount: {{offer.amountOut}} </p>
          <p> Accepting: {{offer.acceptTitle}} </p>
          <p v-if="offer.amountIn"> Amount: {{offer.amountIn}} </p>
          <button @click="acceptOffer(offer)">Accept</button>
        </div>
      </div>
  </div>
</div>

</template>

<script>

import	Interact from 'interactjs'
const Timer = require('./timer.js')

export default {
  name: 'tempus-market',
  props: ['myOffers', 'otherOffers', 'options', 'buildings'],
  data() { return {
    backIcon: 'icons/close.png',
  }},
  computed: {
  },

  methods: {
    closeMarket: function() {
      this.$emit('toggle-market')
    },
    newOffer: function() {
      this.$emit('toggle-trade-dialog')
    },
    acceptOffer: function(offer) {
      if (offer.acceptType === 'capital') {
        if (this.buildings[offer.toAccept].owned === false) {
          this.options.message = 'Cannot accept trade, You do not own the required item(s)'
          return
        }
      }
      else if (offer.acceptType === 'commodity') {
        if (this.buildings[offer.toAccept].commodityAmount <= offer.amountIn) {
          this.options.message = 'Cannot accept trade, You do not own the required item(s)'
          return
        }
      }
      this.otherOffers.splice(this.otherOffers.indexOf(offer), 1)
      this.$emit('accept-offer', offer.id)
    }
  },

  mounted: function() {
  }
}

</script>

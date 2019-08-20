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
    <!-- Time -->
    <input v-if="(capitalOut === null && commodityOut === null)" class="radiobutton"
      type="radio" id="timeOut" value="Time" v-model="timeOut">
    <label v-if="(capitalOut === null && commodityOut === null)" class="radiotag"
      for="timeOut">Time</label>
    <br>
    <!-- Capital -->
    <select v-if="(timeOut === null && commodityOut === null)" v-model="capitalOut">
      <option disabled value=null> Capital </option>
      <option v-if="building.built" v-for="building in buildings" :value="building.index">
        {{building.title}}
      </option>
    </select>
    <br>
    <!-- Commodities -->
    <select v-if="(timeOut === null && capitalOut === null)" v-model="commodityOut">
      <option disabled value=null> Commodities </option>
      <option v-for="building in buildings" :value="building.index">
        {{building.commodityTitle}}
      </option>
    </select>
    <input v-if="(commodityOut != null || timeOut != null)" v-model.number="amountOut"
      placeholder="Amount to trade"></input>
    <input v-if="(timeOut != null)" v-model.number="lengthOut" placeholder="How long"></input>
    <br>

    <p>Accepting</p>
    <!-- Time -->
    <input v-if="(capitalIn === null && commodityIn === null)" class="radiobutton"
      type="radio" id="timeIn" value="Time" v-model="timeIn">
    <label v-if="(capitalIn === null && commodityIn === null)" class="radiotag"
      for="timeIn">Time</label>
    <br>
    <!-- Capital -->
    <select v-if="(timeIn === null && commodityIn === null)" v-model="capitalIn">
      <option disabled value=null> Capital </option>
      <option v-for="building in allBuildings" :value="building.index">
        {{building.title}}
      </option>
    </select>
    <br>
    <!-- Commodities -->
    <select v-if="(capitalIn === null && timeIn === null)" v-model="commodityIn">
      <option disabled value=null> Commodities </option>
      <option v-for="building in allBuildings" :value="building.index">
        {{building.commodityTitle}}
      </option>
    </select>
    <input v-if="(commodityIn != null || timeIn != null)" v-model.number="amountIn" placeholder="Amount to receive"></input>
    <input v-if="(timeIn != null)" v-model.number="lengthIn" placeholder="How long"></input>
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
  props: ['config', 'buildings', 'allBuildings', 'maxTime',],
  data() { return {
    backIcon: 'icons/close.png',
    capitalOut: null,
    commodityOut: null,
    amountOut: null,
    capitalIn: null,
    commodityIn: null,
    amountIn: null,
    lengthIn: null,
    lengthOut: null,
    timeOut: null,
    timeIn: null,
  }},
  computed: {
  },
  methods: {
    postOffer: function() {
      //General Tests
      if (this.capitalOut === null && this.commodityOut === null && this.timeOut === null) {
        this.config.message = 'Empty Selection, please select what you would like to trade'
      }
      else if (this.capitalIn === null && this.commodityIn === null && this.timeIn === null) {
        this.config.message = 'Empty Selection, please select what you will accept'
      }

      //timeOut
      else if (this.timeOut && this.amountOut === null) {
        this.config.message = 'Please input the percentage of time to trade'
      }
      else if (this.timeOut && this.amountOut > this.maxTime) {
        this.config.message = 'Not enough time available, please input a lower percentage'
      }
      else if (this.timeOut && this.lengthOut === null) {
        this.config.message = 'Please select length of time to trade'
      }
      else if (this.timeOut != null && (typeof this.amountOut) === 'string') {
        this.config.message = 'Invalid trading amount, please input a number'
        //console.log("Invalid type")
      }
      else if (this.timeOut != null && (typeof this.lengthOut) === 'string') {
        this.config.message = 'Invalid trading length, please input a number'
        //console.log("Invalid type")
      }

      //commodityOut
      else if (this.commodityOut != null && this.amountOut === null) {
        this.config.message = 'Please enter an amount to trade'
      }
      else if (this.commodityOut != null && (typeof this.amountOut) === 'string') {
        this.config.message = 'Invalid trading amount, please input a number'
        //console.log("Invalid type")
      }

      //timeIn
      else if (this.timeIn && this.amountIn === null) {
        this.config.message = 'Please input the percentage of time to accept'
      }
      else if (this.timeIn && this.lengthIn === null) {
        this.config.message = 'Please select length of time to accept'
      }
      else if (this.timeIn != null && (typeof this.amountIn) === 'string') {
        this.config.message = 'Invalid accepting amount, please input a number'
        //console.log("Invalid type")
      }
      else if (this.timeIn != null && (typeof this.lengthIn) === 'string') {
        this.config.message = 'Invalid accepting length, please input a number'
        //console.log("Invalid type")
      }

      //commodityIn
      else if (this.commodityIn != null && this.amountIn === null) {
        this.config.message = 'Please enter an amount to accept'
      }
      else if (this.commodityIn != null && (typeof this.amountIn) === 'string') {
        this.config.message = 'Invalid accepting amount, please input a number'
      }

      //Bugs
      else if (this.capitalOut != null && this.capitalOut.built == false) {
        this.config.message = 'Cannot trade an unfinished building (bug)'
      }
      else if (this.capitalOut != null && this.commodityOut != null) {
        this.config.message = 'Please only select one thing to trade (bug)'
      }
      else if (this.capitalOut != null && this.amountOut != null) {
        this.amountOut = null
        this.config.message = 'Capital and amount selected (bug)'
      }
      else if (this.capitalIn != null && this.commodityIn != null) {
        this.config.message = 'Please only select one thing to accept (bug)'
      }
      //Emitting offers
      //time
      else if (this.timeOut != null) {
        if (this.capitalIn != null) {
          this.$emit('post-offer', 'time', 'capital', this.timeOut, this.amountOut, this.lengthOut,
            this.capitalIn, null, null,)
        }
        else if (this.timeIn != null) {
          this.$emit('post-offer', 'time', 'time', this.timeOut, this.amountOut, this.lengthOut,
            this.timeIn, this.amountIn, this.lengthIn,)
        }
        else {
          this.$emit('post-offer', 'time', 'commodity', this.timeOut, this.amountOut, this.lengthOut,
            this.commodityIn, this.amountIn, null,)
        }
      }
      //capital
      else if (this.capitalOut != null) {
        if (this.capitalIn != null) {
          this.$emit('post-offer', 'capital', 'capital', this.capitalOut, null, null, this.capitalIn,
            null, null,)
        }
        else if (this.timeIn != null) {
          this.$emit('post-offer', 'capital', 'time', this.capitalOut, null, null, this.timeIn,
            this.amountIn, this.lengthIn,)
        }
        else {
          this.$emit('post-offer', 'capital', 'commodity', this.capitalOut, null, null, this.commodityIn,
            this.amountIn, null,)
        }
      }
      //commodity
      else if (this.commodityOut != null) {
        if (this.allBuildings[this.commodityOut].commodityAmount < this.amountOut) {
          this.config.message = 'Amount is greater than amount owned, please enter a lower amount'
        }
        else {
          if (this.capitalIn != null) {
            this.$emit('post-offer', 'commodity', 'capital', this.commodityOut, this.amountOut, null,
              this.capitalIn, null, null,)
          }
          else if (this.timeIn != null) {
            this.$emit('post-offer', 'commodity', 'time', this.commodityOut, this.amountOut, null,
              this.timeIn, this.amountIn, this.lengthIn,)
          }
          else {
            this.$emit('post-offer', 'commodity', 'commodity', this.commodityOut, this.amountOut, null,
              this.commodityIn, this.amountIn, null,)
          }
        }
      }
      this.clear()
    },
    clear: function() {
      this.commodityOut = null
      this.capitalOut = null
      this.amountOut = null
      this.commodityIn = null
      this.capitalIn = null
      this.amountIn = null
      this.timeOut = null
      this.timeIn = null
      this.lengthOut = null
      this.lengthIn = null
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

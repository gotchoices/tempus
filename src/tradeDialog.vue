//Tempus Valorem - Trading Dialog
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>
<div>
  <div id="tradeDialog" class="sidenav rightMenu" :style="'width: ' + config.width + 'px'">
    <span>
      <img class="icon closebtn" :src="backIcon" @click="$emit('toggle-trade-dialog')"/>
    </span>
    <h2> Trade Dialog </h2>
    <form>
      <label for="offering"> Your offer: </label>
      <input type="text" id="offering" name="offering">
      <label for="payment"> Preferred Payment </label>
      <input type="text" id="payment" name="payment">
    </form>
    <button> Post Offer </button>
  </div>
</div>
</template>

<script>

export default {
  name: 'tempus-trade-dialog',
  props: ['config'],
  data() { return {
    backIcon: 'icons/close.png',
  }},
  computed: {
  },
  methods: {
  },
}

</script>

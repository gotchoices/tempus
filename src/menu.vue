//Tempus Valorem - Main menu
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//- 

<template>
  <div class="tempus menu">
    <div class="tempus menuIcon" @click="postMenu">
      Menu
    </div>
    <div class="tempus menuList" v-show="menuPosted" @click="menuSelect">
      <ul>
        <li v-for="item in menuItems" @click="menuSelect(item.code)">{{item.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import	Interact from 'interactjs'
const	NativeSVG = 600					//Original SVG size

export default {
  name: 'tempus-time',
  props: {
  },
  data() { return {
    menuPosted:	false,
  }},
  computed: {
    menuItems: function() {return [
      {code:'set',	title: 'Settings'},
      {code:'fact',	title: 'Factory'},
      {code:'trade',	title: 'Trades'},
    ]}
  },

  methods: {
    postMenu(code) {
      this.menuPosted = !this.menuPosted
console.log("Posting menu:", this.menuPosted, code)
    },
    menuSelect(ev) {
console.log("Menu item:")
    },
  },

  mounted: function() {
  }
}

</script>

<style lang="less">
  .tempus.menuList {
    background: #eeeeee;
    position: absolute;
  }
</style>

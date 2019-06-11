//Tempus Valorem - Main menu
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>
<div>
<div>
  <div id="mySidenav" class="sidenav" :style="slideStyle">
    <span>
      <img class="icon closebtn" :src="backIcon" @click="$emit('sub-menu', config.code)"/>
    </span>
    <span class="sidenavTitle"> {{config[depth].title}} </span>
    <div class="sidenavButtons"
      v-for="(item, index) in config[depth].children"
      v-on:click="$emit('sub-menu', item.config.children[index].code)">
      {{item}} </div>
  </div>

</div>
</div>
</template>

<script>

export default {
  name: 'tempus-menu',
  props: ['depth', 'config'],
  data() { return {
    navOpen: false,
    backIcon: 'icons/left-arrow.png',
  }},
  computed: {
    menuWidth: function() {
      if(config.show) {
        return 250
      }
      else {
        return 0
      }
    },
    slideStyle: function() {return{
      width: this.menuWidth + 'px'
    }},
    menuItems: function() {return [
      {code:'build',	title: 'Buildings', index: 0,},
      {code:'trade',	title: 'Trade', index: 1,},
      {code:'set',	title: 'Settings', index: 2,},
    ]},
    buildingItems: function()  {return [
      {title: 'Farm', index: 0,},
      {title: 'Factory', index: 1,},
    ]},
  },

  methods: {
    menuSelect(code) {
      console.log("Menu item:", code)
    },
    toggleNav: function() {
      this.navOpen = !this.navOpen
      console.log("Nav toggled:", this.navOpen, " menuWidth: " , this.menuWidth)
      if(this.navOpen) {
        this.menuWidth = 250
      }
      else {
        this.menuWidth = 0
      }
    },

  },
}

</script>

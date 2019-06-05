//Tempus Valorem - Main menu
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>
<div>
  <div id="mySidenav" class="sidenav" :style="slideStyle">
   <a href="javascript:void(0)" class="closebtn" @click="toggleNav" >&times;</a>
   <div class="sidenavButtons"
   v-for="item in menuItems"
   v-on:click="openSubMenu">
   {{item.title}} </div>
  </div>
  <div id="buildingSidenav" class="sidenav" style="width: 0">
    <a href="javascript:void(0)" class="closebtn" @click="toggleNav" >&times;</a>
    <div class="sidenavButtons"
    v-for="item in buildingItems"
    v-on:click="$emit('addBuilding', item.index)">
    {{item.title}} </div>
  </div>

  <span class="open" @click="toggleNav">
    <img class="icon" :src="menuIcon" />
  </span>
</div>

</template>

<script>

export default {
  name: 'tempus-menu',
  props: {
  },
  data() { return {
    navOpen: false,
    menuIcon: 'icons/right-arrow.png',
    menuWidth: 0
  }},
  computed: {
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
      console.log("Nav toggled:", this.navOpen)
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

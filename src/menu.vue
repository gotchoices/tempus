//Tempus Valorem - Main menu
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------
//TODO:
//-

<template>
<div>
  <div id="mySidenav" class="sidenav leftMenu" :style="'width: ' + options.width + 'px'">
    <span>
      <img class="icon closebtn" :src="backIcon" @click="$emit('post-menu', null, config.index)"/>
    </span>
    <span class="sidenavTitle"> {{config.title}} </span>
    <div class="sidenavButtons"
      v-for="item in config.subMenu"
      v-on:click="$emit(item.method, item.link, config.index)">
      {{item.name}}
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'tempus-menu',
  props: ['config', 'options'],
  data() { return {
    backIcon: 'icons/left-arrow.png',
  }},
  computed: {
  },

  methods: {
  },

}

</script>

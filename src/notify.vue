//Tempus Valorem - Notification Panel Component
//Copyright Kyle Bateman; all rights reserved
// -----------------------------------------------------------------------------

<template>

  <div>
    <div class="notificationsPanel sidenav rightMenu" :style="'width: ' + config.width + 'px'">
      <span>
        <img class="icon closebtn" :src="backIcon" @click="closeNotify"/>
      </span>
      <h2> Notifications </h2>
      <button @click="clearAll"> Clear All </button>
      <div v-for="(note, index) in notes">
        <!-- <img class="icon" :src="backIcon" @click="closeOne(index)"/> -->
        <p> {{note.message}} </p>
      </div>
    </div>
  </div>


</template>

<script>

import	Interact from 'interactjs'
const Timer = require('./timer.js')

export default {
  name: 'tempus-notify',
  props: ['config', 'notes',],
  data() { return {
    backIcon: 'icons/close.png',
  }},
  computed: {
  },

  methods: {
    closeNotify: function() {
      this.$emit('toggle-notify')
    },
    clearAll: function() {
      this.notes.splice(0, this.notes.length)
    },
    closeOne: function(index) {
      this.notes.splice(index, 1)
    },
  },

  mounted: function() {
  }
}

</script>

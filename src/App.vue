<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import NavBar from './components/NavBar.vue';

// import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'App',

  components: {
    NavBar,
  },

  data: () => ({
  }),
});
</script>
<style>
  body{
    font-family: 'Helvetica';
  }
  p{
    margin: 0;
  }
</style>

<template>
  <v-app>
    <div class="bg">
<!--      <img src="@/assets/bg_black.png">-->
    </div>
    <nav-bar></nav-bar>
    <v-content class="content">
      <router-view class="router_view"></router-view>
    </v-content>
      <Footer class="footer"></Footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

// import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'App',

  components: {
      NavBar,
      Footer
  },

  data: () => ({
  }),

    created(): void {
      this.$store.dispatch('init');
    }
});
</script>
<style scoped lang="scss">
  .v-application{
    background-color: #F8F9FA !important;
  }
  .bg{
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;

    img{
      width: 100%;
      object-fit: cover;
      opacity: 0.03;
    }
  }

  .content{
    position: relative;
  }

  .router_view{
    box-sizing: border-box;
  }

    .footer{
        margin-top: 15vh;
    }
</style>
<style>
  body{
    font-family: 'Helvetica';
    margin: 0;
    background-color: #F8F9FA;
  }
  p{
    margin: 0;
  }
</style>

<template>
    <v-app>
        <nav-bar class="navbar"></nav-bar>
        <v-content class="content">
            <router-view class="router_view"></router-view>
        </v-content>
        <Footer class="footer"></Footer>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";

export default Vue.extend({
    name: "App",
    components: {
        NavBar,
        Footer
    },
    data: () => ({}),
    created(): void {
        this.$store.dispatch("init");
        this.$store.dispatch("Platform/init");
    }
});
</script>

<style scoped lang="scss">
@use 'main';
.v-application {
    background-color: #f8f9fa !important;
}
.bg {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;

    img {
        width: 100%;
        object-fit: cover;
        opacity: 0.03;
    }
}

.content {
    position: relative;
}

.router_view {
    box-sizing: border-box;
}

.footer {
    margin-top: 15vh;
}

.router_view, 
.navbar, 
.footer {
    padding: main.$container_padding_l;
}

@media only screen and (max-width: main.$mobile_width) {
    .router_view, 
    .navbar, 
    .footer {
        padding: main.$container_padding_mobile;
    }
}

@media only screen and (max-width: main.$medium_width) {
    .router_view, 
    .navbar,
    .footer {
        padding: main.$container_padding_s;
    }
}
</style>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@500&display=swap');

body {
    font-family: "Helvetica";
    margin: 0;
    background-color: #f8f9fa;
}

p {
    margin: 0;
}

.ava-monospace {
    font-family: "Inconsolata", monospace;
    font-size: 1.2em;
}

.v-application a {
    color: #71c5ff !important;
    text-decoration: none;
    font-weight: normal;

    &:hover {
        text-decoration: underline;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, 
.fade-leave-to 
/* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>

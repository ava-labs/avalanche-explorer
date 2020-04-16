<template>
    <v-app-bar
            app
            :color="theme.nav"
            dark
            :height="60"
    >
        <div class="d-flex align-center">
            <router-link to="/">EXPLORER</router-link>
        </div>
        <v-spacer></v-spacer>
        <search-bar class="search_bar"></search-bar>
        <v-spacer></v-spacer>
    </v-app-bar>
</template>
<script>
    import Vue from "vue";
    import SearchBar from "@/components/SearchBar";

    export default Vue.extend({
        components: {
            SearchBar,
        },
        computed:{
            themeType(){
                return (this.$vuetify.theme.dark) ? 'dark' : 'light'
            },
            theme(){
                return this.$vuetify.theme.themes[this.themeType]
            }
        }
    })
</script>

<style scoped>

    .search_bar{
        width: 25vw;
    }
</style>
<template>
    <v-app-bar
            app
            dark
            :height="60"
            flat
            :style="{
                backgroundColor: navColor
            }"
    >
        <div class="d-flex align-center">
            <router-link to="/">EXPLORER</router-link>
        </div>
        <v-spacer></v-spacer>
        <search-bar v-if="showSearch" class="search_bar"></search-bar>
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
            },
            showSearch(){
                if(this.$router.currentRoute.name == "Home"){
                    return false;
                }
                return true;
            },
            navColor(){
                let res = this.theme.nav;

                if(this.$router.currentRoute.name == "Home"){
                    res = "transparent";
                }
                return res;
            }
        }
    })
</script>

<style scoped>

    .search_bar{
        width: 25vw;
    }
</style>
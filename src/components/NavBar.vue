<template>
    <v-app-bar
            app
            color="primary"
            dark
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
        }
    })
</script>
<style scoped>
    .search_bar{
        width: 25vw;
    }
</style>
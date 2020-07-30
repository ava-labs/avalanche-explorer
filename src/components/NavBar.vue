<template>
    <v-app-bar
        class="navbar"
        app
        dark
        flat
        dense
        :height="100"
        :style="{backgroundColor: navColor}"
    >
        <div class="logo">
            <router-link to="/">
                <img style="width: 200px" src="@/assets/explorer_logo.png" />
                <h1><span class="hide">Avalanche Explorer</span><span class="subnet">Denali</span></h1>
            </router-link>
        </div>
        <v-spacer class="spacer_mid"></v-spacer>
        <div class="rightside">
            <div class="row" style="display: flex">
                <div class="routes">
                    <router-link to="/">Home</router-link>
                    <router-link to="/subnets">Subnets</router-link>
                    <router-link to="/validators">Validators</router-link>
                    <router-link to="/assets">Assets</router-link>
                    <a href="https://cchain.explorer.avax.network/">C-Chain</a>
                    <router-link to="/resources">Resources</router-link>
                </div>
            </div>
            <div class="row">
                <search-bar
                    class="search_bar"
                    placeholder="Search by Address / TxId / Asset"
                    @search="onsearch"
                ></search-bar>
            </div>
        </div>
    </v-app-bar>
</template>

<script>
import Vue from "vue";
import SearchBar from "@/components/misc/SearchBar/SearchBar";

export default Vue.extend({
    components: {
        SearchBar
    },
    methods: {
        onsearch(val) {
            this.$router.push({ path: "/search", query: { query: val } });
        }
    },
    computed: {
        themeType() {
            return this.$vuetify.theme.dark ? "dark" : "light";
        },
        theme() {
            return this.$vuetify.theme.themes[this.themeType];
        },
        showSearch() {
            return (this.$router.currentRoute.name === "Home") ? false : true;
        },
        navColor() {
            return "#fff";
        }
    }
});
</script>

<style scoped lang="scss">
@use "../main";

.navbar {
    z-index: 10 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    > .v-toolbar__content {
        padding: 0;
    }
}

.logo {
    height: 100%;
    padding: 15px 0px;
    white-space: nowrap;
    box-sizing: border-box;

    a {
        display: flex;
        align-items: center;
        flex-direction: row;
        height: 100%;
        color: #000 !important;
        text-decoration: none !important;
    }

    h1 {
        padding-left: 10px;
        margin: 0;

        &:hover {
            opacity: 0.7;
            text-decoration: none !important;
        }

        .hide {
            font-size: 0;
            width: 1px;
            height: 1px;
            display: inline-block;
            overflow: hidden;
            position: absolute!important;
            border: 0!important;
            padding: 0!important;
            margin: 0!important;
            clip: rect(1px,1px,1px,1px);
        }

        .subnet {
            font-size: 12px;
            color: main.$primary-color;
            padding-bottom: 7px;
            display: inline-block;
        }
    }
    img {
        max-height: calc(100% - 15px);
    }
}

.search_bar {
    width: 375px;
}

.rightside {
    justify-content: end;

    > div {
        justify-content: flex-end;
        margin: 8px 0px;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
}

.routes {
    overflow: auto;
    padding: 4px 0px;
    white-space: normal;
}

.routes a {
    color: main.$black !important;
    font-weight: 600;
    font-size: 14px;
    padding-right: 20px;

    &.router-link-exact-active {
        color: main.$primary-color !important;
    }
    
    &:hover {
        opacity: 0.7;
        text-decoration: none;
    }

    &:last-child {
        padding-right: 0;
    }
}

@include main.device_s {    
    .logo {
        height: 100%;
        padding: 15px 0px 15px 6px;
        display: flex;
        flex-direction: column;


    a {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        height: 100%;
    }

    h1 {
        padding-left: 161px;
        height: 12px;
        .subnet {
            font-size: 12px;
            color: main.$primary-color;
            padding-top: 9px;
            padding-bottom: 0;
            display: block;
        }
    }

    img {
        max-height: calc(100% - 15px);
    }
}

    .rightside {
        width: 100%;
        overflow: auto;
    }

    .spacer_mid {
        display: none;
    }
}
</style>

<style lang="scss">
.v-toolbar__content {
    padding: 0 !important;
}
</style>
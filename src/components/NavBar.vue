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
                <img style="width: 60px" src="@/assets/AVA-black.png" />
                <h1>Explorer <span>Denali</span></h1>
            </router-link>
        </div>
        <v-spacer class="spacer_mid"></v-spacer>
        <div class="rightside">
            <div class="row" style="display: flex">
                <div class="routes">
                    <router-link to="/">Home</router-link>
                    <router-link to="/subnets">Subnets</router-link>
                    <router-link to="/validators">Validators</router-link>
                    <router-link to="/tokens">Tokens</router-link>
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
            if (this.$router.currentRoute.name == "Home") {
                return false;
            }
            return true;
        },
        navColor() {
            let res = "#fff";
            // console.log(this.theme);

            // if(this.$router.currentRoute.name == "Home"){
            //     res = "transparent";
            // }
            // console.log(res);
            return res;
        }
    }
});
</script>

<style>
.v-toolbar__content {
    padding: 0 !important;
}
</style>

<style scoped lang="scss">
@use '../main';

.navbar {
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
        font-size: 24px;
        padding-left: 10px;

        &:hover {
            opacity: 0.7;
            text-decoration: none !important;
        }

        span {
            font-size: 12px;
            color: #71c5ff;
        }
    }
    img {
        max-height: calc(100% - 15px);
    }
}
.search_bar {
    width: 25vw;
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
    color: #222 !important;
    font-weight: 600;
    font-size: 14px;
    padding-right: 20px;

    &.router-link-exact-active {
        color: #71C5FF !important;
    }
    
    &:hover {
        opacity: 0.7;
        text-decoration: none;
    }

    &:last-child {
        padding-right: 0;
    }
}

.avatar {
    margin-left: 10px;
    background-color: #f1f2f3;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    flex-basis: 24px;
}

@include main.sm-device {
    h1 {
        display: none;
    }

    .logo {
        display: none;
        height: 40px;
        padding: 0;
    }
    .rightside {
        width: 100%;
        overflow: auto;
    }
    .spacer_mid {
        display: none;
    }
    .search_bar {
        width: 100%;
    }
}
</style>

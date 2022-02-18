<template>
    <v-app-bar
        div="navbar"
        app
        dark
        flat
        dense
        :height="76"
        :style="{ backgroundColor: navColor }"
    >
        <!-- LEFT -->
        <div class="logo">
            <!-- Just hardcoding to mainnet explorer since this file isn't used -->
            <a href="https://explorer.avax.network/">
                <img
                    style="height: 31px"
                    src="@/assets/explorer_logo_black.png"
                />
                <h1>
                    <span class="hide">Avalanche Explorer</span>
                </h1>
            </a>
        </div>
        <v-spacer class="spacer_mid"></v-spacer>
        <!-- MIDDLE -->
        <div class="row">
            <SearchBar
                class="search_bar"
                placeholder="Search by Address / TxId / Asset"
                @search="onsearch"
            />
        </div>
        <v-spacer class="spacer_mid"></v-spacer>
        <!-- LEFT -->
        <div class="rightside">
            <NetworkMenu />
        </div>
    </v-app-bar>
</template>

<script>
import Vue from 'vue'
import SearchBar from '@/components/misc/SearchBar/SearchBar'
import NetworkMenu from './NetworkSettings/NetworkMenu.vue'

export default Vue.extend({
    components: {
        SearchBar,
        NetworkMenu,
    },
    computed: {
        themeType() {
            return this.$vuetify.theme.dark ? 'dark' : 'light'
        },
        theme() {
            return this.$vuetify.theme.themes[this.themeType]
        },
        showSearch() {
            return this.$router.currentRoute.name === 'Home' ? false : true
        },
        // overrides Vuetify theme
        navColor() {
            return '#fff'
        },
    },
    methods: {
        onsearch(val) {
            this.$router.push({ path: '/search', query: { query: val } })
        },
    },
})
</script>

<style scoped lang="scss">
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
    padding: 12px 0;
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

        .hide {
            font-size: 0;
            width: 1px;
            height: 1px;
            display: inline-block;
            overflow: hidden;
            position: absolute !important;
            border: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            clip: rect(1px, 1px, 1px, 1px);
        }

        .subnet {
            font-size: 12px;
            color: $primary-color;
            padding-bottom: 7px;
            display: inline-block;
        }
    }

    img {
        max-height: calc(100% - 15px);
    }

    span {
        color: $primary-color;
    }
}

.row {
    width: 33%;
    max-width: 600px;

    .search_bar {
        width: 100%;
    }
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

@include smOnly {
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
                color: $primary-color;
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
#navbar {
    .v-toolbar__content {
        padding: 0 !important;
        height: 91px !important;
    }
}
</style>

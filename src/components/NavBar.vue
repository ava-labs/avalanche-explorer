<template>
    <v-app-bar
        div="navbar"
        app
        dark
        flat
        dense
        :height="140"
        :style="{ backgroundColor: navColor }"
    >
        <div class="top">
            <div class="logo">
                <router-link to="/">
                    <img
                        style="height: 23px"
                        :src="
                            require(`@/assets/explorer_logo_${logoColor}.png`)
                        "
                    />
                    <h1>
                        <span class="hide">Avalanche Explorer</span>
                    </h1>
                </router-link>
            </div>
            <v-spacer class="spacer_mid"></v-spacer>
            <div class="links">
                <div class="routes">
                    <router-link to="/">Home</router-link>
                    <router-link to="/subnets">Subnets</router-link>
                    <router-link to="/validators">Validators</router-link>
                    <router-link to="/assets">Assets</router-link>
                    <router-link to="/blockchains">Blockchains</router-link>
                    <a :href="cChainURL">C-Chain</a>
                    <a :href="statusPageURL">Status</a>
                    <router-link to="/resources">Resources</router-link>
                </div>
            </div>
            <v-spacer class="spacer_mid"></v-spacer>
            <NetworkMenu />
        </div>
        <div class="bottom">
            <div class="prices">
                <div class="price_pair">
                    <span class="label">AVAX</span>
                    <span class="value">$-.--</span>
                </div>
                <div class="price_pair">
                    <span class="label">Market Cap</span>
                    <span class="value">$-</span>
                </div>
            </div>
            <div>
                <SearchBar
                    class="search_bar"
                    placeholder="Search by Address / TxId / Asset"
                    @search="onsearch"
                />
            </div>
        </div>
    </v-app-bar>
</template>

<script>
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import SearchBar from '@/components/misc/SearchBar/SearchBar'
import NetworkMenu from './NetworkSettings/NetworkMenu.vue'
import {
    DEFAULT_NETWORK_ID,
    cChainExplorerURL,
    cChainExplorerURL_test,
    statusURL,
    statusURL_test,
} from '@/store/modules/network/network'

@Component({
    components: {
        SearchBar,
        NetworkMenu,
    },
<<<<<<< HEAD
=======
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
        navColor() {
            return DEFAULT_NETWORK_ID === 1 ? '#fff' : '#2196f3'
        },
        logoColor() {
            return DEFAULT_NETWORK_ID === 1 ? 'light' : 'white'
        },
        cChainURL() {
            return DEFAULT_NETWORK_ID === 1
                ? cChainExplorerURL
                : cChainExplorerURL_test
        },
        statusPageURL() {
            return DEFAULT_NETWORK_ID === 1 ? statusURL : statusURL_test
        },
    },
    methods: {
        onsearch(val) {
            this.$router
                .push({ path: '/search', query: { query: val } })
                .catch((error) => {
                    if (error.name != 'NavigationDuplicated') {
                        throw error
                    }
                })
        },
    },
>>>>>>> master
})
export default class Navbar extends Vue {
    currencies = ['USD', 'AVAX']

    get themeType() {
        return this.$vuetify.theme.dark ? 'dark' : 'light'
    }
    get theme() {
        return this.$vuetify.theme.themes[this.themeType]
    }
    get showSearch() {
        return this.$router.currentRoute.name === 'Home' ? false : true
    }
    get navColor() {
        return DEFAULT_NETWORK_ID === 1 ? '#FFF' : '#2196f3'
    }
    get logoColor() {
        return DEFAULT_NETWORK_ID === 1 ? 'black' : 'white'
    }
    get cChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? cChainExplorerURL
            : cChainExplorerURL_test
    }

    onsearch(val) {
        this.$router
            .push({ path: '/search', query: { query: val } })
            .catch((error) => {
                if (error.name != 'NavigationDuplicated') {
                    throw error
                }
            })
    }
}
</script>

<style scoped lang="scss">
.navbar {
    z-index: 10 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    border-bottom: 1px solid $primary-color-xlight;
    display: flex !important;
    flex-direction: column !important;
}

.top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;
}

.logo {
    display: flex;
    flex-direction: row;
    padding: 15px 0px;
    white-space: nowrap;
    box-sizing: border-box;

    a {
        display: flex;
        align-items: center;
        flex-direction: row;
        height: 100%;
        color: $primary-color !important;
        text-decoration: none !important;

        img {
            height: 23px;
        }
    }

    h1 {
        padding-left: 20px;
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
}

.network_menu {
    margin-left: 20px !important;
}

.bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.prices {
    display: flex;
    flex-direction: row;

    .price_pair {
        display: flex;
        align-items: baseline;

        &:first-of-type {
            margin-right: 20px;
        }

        .label {
            font-size: 18px;
            color: $primary-color-light !important;
            margin-right: 5px;
        }

        .value {
            font-weight: 500;
            font-size: 26px;
            line-height: 140%;
            color: $primary-color !important;
        }
    }
}

.search_bar {
    min-width: 375px;
    width: 100%;
}

.links {
    justify-content: space-between;

    > div {
        justify-content: center;
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
    color: $primary-color !important;
    font-size: 13px;
    padding-right: 30px;

    &.router-link-exact-active {
        color: $primary-color !important;
        font-weight: 700;
    }

    &:hover {
        opacity: 0.7;
        text-decoration: none;
    }

    &:last-child {
        padding-right: 0;
    }
}

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    .routes a {
        color: rgba(255, 255, 255, 0.72) !important;

        &.router-link-exact-active {
            color: $white !important;
        }
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

    .links {
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
    .v-toolbar--dense .v-toolbar__content,
    .v-toolbar--dense .v-toolbar__extension {
        padding-top: 0;
        padding-bottom: 0;
        padding-right: 0;
        padding-left: 0;
    }
}
</style>

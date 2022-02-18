<template>
    <div class="navbar_mobile">
        <!--   TOOLBAR    -->
        <div class="inner">
            <div class="logo">
                <a :href="cChainURL">
                    <img
                        style="height: 20px"
                        :src="
                            require(`@/assets/explorer_logo_${logoColor}.png`)
                        "
                    />
                    <h1><span class="hide">Avalanche Explorer</span></h1>
                </a>
            </div>
            <div class="buttons">
                <NetworkMenu />
                <v-btn icon class="search_btn" @click="isSearch = !isSearch">
                    <fa icon="search"></fa>
                </v-btn>
                <v-btn icon @click="isDrawer = !isDrawer">
                    <fa icon="bars"></fa>
                </v-btn>
            </div>
        </div>
        <!--   MOBILE MENU     -->
        <v-navigation-drawer v-model="isDrawer" fixed style="z-index: 999">
            <v-list dense nav>
                <v-list-item>
                    <div class="drawer_img_container">
                        <img
                            :src="
                                require(`@/assets/explorer_logo_${logoColor}.png`)
                            "
                            class="drawer_img"
                        />
                    </div>
                </v-list-item>
                <template>
                    <v-list-item :href="cChainURL">Home</v-list-item>
                    <v-list-item to="/subnets">Subnets</v-list-item>
                    <v-list-item to="/validators">Validators</v-list-item>
                    <v-list-item :href="tokensURL">Tokens</v-list-item>
                    <v-list-item to="/blockchains">Blockchains</v-list-item>
                    <v-list-item to="/tx">Transactions</v-list-item>
                    <v-list-item v-if="isMainnet" :href="statsURL"
                        >Stats</v-list-item
                    >
                    <v-list-item :href="cChainURL">C-Chain</v-list-item>
                    <v-list-item :href="statusPageURL">Status</v-list-item>
                    <v-list-item to="/resources">Resources</v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <!--   SEARCH     -->
        <v-dialog
            v-model="isSearch"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <v-card>
                <div v-if="isSearch" class="search_container">
                    <SearchBarMobile
                        class="search_bar"
                        placeholder="Search by Address / TxId / Asset"
                        @search="onsearch"
                        @change="closeSearch"
                    />
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SearchBarMobile from '@/components/misc/SearchBar/SearchBarMobile.vue'
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
        SearchBarMobile,
        NetworkMenu,
    },
})
export default class NavbarMobile extends Vue {
    isDrawer = false
    isSearch = false

    onsearch(val: string) {
        this.$router.push({ path: '/search', query: { query: val } })
    }

    get showSearch() {
        return this.$router.currentRoute.name === 'Home' ? false : true
    }

    get logoColor() {
        return DEFAULT_NETWORK_ID === 1 ? 'black' : 'white'
    }

    get navColor() {
        return '#fff'
    }

    get cChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? cChainExplorerURL
            : cChainExplorerURL_test
    }

    get tokensURL() {
        return DEFAULT_NETWORK_ID === 1
            ? 'https://avascan.info/tokens'
            : 'https://testnet.avascan.info/tokens'
    }

    get statsURL() {
        return 'https://stats.avax.network/'
    }

    get isMainnet() {
        return DEFAULT_NETWORK_ID === 1 ? true : false
    }

    get statusPageURL() {
        return DEFAULT_NETWORK_ID === 1 ? statusURL : statusURL_test
    }

    closeSearch(val: boolean) {
        this.isSearch = val
    }
}
</script>

<style scoped lang="scss">
.navbar_mobile {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    background-color: $white;
    border-bottom: 1px solid #c4c4c4;

    > .v-toolbar__content {
        padding: 0;
    }

    .v-btn {
        border: none !important;
    }
}

/* ==========================================
   toolbar
   ========================================== */

.inner {
    display: flex;
    padding: 10px 9px 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.buttons {
    display: flex;
    justify-content: center;
}

.search_btn {
    padding-right: 15px;
}

.logo {
    height: 100%;
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
        font-size: 20px;
        padding-left: 10px;
        font-weight: 400;
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
            padding-bottom: 2px;
            display: inline-block;
        }
    }
    img {
        max-height: calc(100% - 15px);
    }
}

a {
    text-decoration: none;
    font-weight: 400;
    white-space: nowrap;
    margin-right: 15px;
}

/* ==========================================
   sidenav
   ========================================== */

.title {
    font-size: 20px;
    padding-left: 16px;
    padding-bottom: 7px;
}

.drawer_img_container {
    height: 54px;
    display: flex;
    align-items: center;

    .drawer_img {
        padding-bottom: 10px;
        height: 24px;
    }
}

button {
    font-weight: 400;
}

/* ==========================================
   search
   ========================================== */

.search_container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 9px 8px;
    border-bottom: 2px solid $gray-input;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;

    .v-btn {
        border: none !important;
    }

    .search_bar {
        width: 100%;
    }
}
</style>

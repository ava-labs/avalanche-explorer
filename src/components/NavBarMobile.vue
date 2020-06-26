<template>
    <div class="navbar_mobile">
        <!--   TOOLBAR     -->
        <div class="inner">
            <div class="logo">
                <router-link to="/">
                    <img style="height: 24px" src="@/assets/yeti_logo.png" />
                    <h1>
                        <span>Denali</span>
                        Explorer
                    </h1>
                </router-link>
            </div>
            <div>
                <v-btn @click="isSearch = !isSearch" icon class="search_btn">
                    <fa icon="search"></fa>
                </v-btn>
                <v-btn @click="isDrawer = !isDrawer" icon>
                    <fa icon="bars"></fa>
                </v-btn>
            </div>
        </div>
        <!--   MOBILE MENU     -->
        <v-navigation-drawer v-model="isDrawer" fixed style="z-index: 999;">
            <v-list dense nav>
                <v-list-item>
                    <img src="@/assets/yeti_logo.png" class="drawer_img" />
                    <div class="title">AVA Explorer</div>
                </v-list-item>
                <template>
                    <v-list-item to="/">Home</v-list-item>
                    <v-list-item to="/subnets">Subnets</v-list-item>
                    <v-list-item to="/validators">Validators</v-list-item>
                    <v-list-item to="/assets">Assets</v-list-item>
                    <v-list-item to="/resources">Resources</v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <!--   SEARCH     -->
        <v-dialog v-model="isSearch" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <div class="search_container" v-if="isSearch">
                    <search-bar-mobile
                        class="search_bar"
                        placeholder="Search by Address / TxId / Asset"
                        @search="onsearch"
                        @change="closeSearch"
                    ></search-bar-mobile>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SearchBarMobile from "@/components/misc/SearchBar/SearchBarMobile.vue";

@Component({
    components: {
        SearchBarMobile
    }
})
export default class NavbarMobile extends Vue {
    isDrawer: boolean = false;
    isSearch: boolean = false;

    onsearch(val: string) {
        this.$router.push({ path: "/search", query: { query: val } });
    }

    get showSearch() {
        return this.$router.currentRoute.name === "Home" ? false : true;
    }

    get navColor() {
        return "#fff";
    }

    closeSearch(val: boolean) {
        this.isSearch = val;
    }
}
</script>

<style scoped lang="scss">
@use "../main";

.navbar_mobile {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    background-color: main.$white;

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

        span {
            color: main.$primary-color;
        }
    }
    img {
        max-height: calc(100% - 15px);
    }
}

a {
    text-decoration: none;
    font-weight: 400; /* 700 */
    white-space: nowrap;
    margin-right: 15px;
}

/* ==========================================
   sidenav
   ========================================== */

.title {
    font-size: 20px;
    padding-left: 16px;
}

.drawer_img {
    max-height: 50px;
    padding-bottom: 10px;
}

button {
    font-weight: 400; /* 700 */
}

/* ==========================================
   search
   ========================================== */

.search_container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 9px 8px;
    border-bottom: 2px solid main.$gray-input;
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

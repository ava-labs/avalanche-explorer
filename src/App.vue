<template>
    <v-app class="butt">
        <nav-bar-mobile v-if="$vuetify.breakpoint.smAndDown"></nav-bar-mobile>
        <NavBarOld class="navbarold" v-if="$vuetify.breakpoint.mdAndUp && $vuetify.breakpoint.lgAndDown"></NavBarOld>
        <nav-bar class="navbar" v-if="$vuetify.breakpoint.xlOnly"></nav-bar>
        <template></template>
        <div class="side_container">
            <NavBarSide v-if="$vuetify.breakpoint.xlOnly"></NavBarSide>
            <v-content class="content">
                <router-view class="router_view"></router-view>
            </v-content>
        </div>  
        <!-- <responsive-guidelines></responsive-guidelines> -->

        <!-- <Footer class="footer"></Footer> -->
        <notifications></notifications>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NavBar from "@/components/NavBar.vue";
import NavBarMobile from "@/components/NavBarMobile.vue";
import NavBarOld from "@/components/NavBarOld.vue";
import NavBarSide from "@/components/NavBarSide.vue";
// import Footer from "@/components/Footer.vue";
// import ResponsiveGuidelines from "@/components/misc/ResponsiveGuidelines.vue";
import { IMetaTag } from "@/router/IMetaTag";
import Notifications from "@/components/Notifications.vue";

export default Vue.extend({
    name: "App",
    components: {
        NavBar,
        NavBarMobile,
        NavBarOld,
        NavBarSide,
        // ResponsiveGuidelines,
        // Footer,
        Notifications
    },
    data: () => ({}),
    async created() {
        this.$store.dispatch("init");
        this.$store.dispatch("Platform/init");
        await this.$store.dispatch('Network/init');
    },
    watch: {
        $route: {
            handler: (to, from) => {
                // Remove stale tags from the document using key attribute
                Array.from(document.querySelectorAll("[vue-router-data]"))
                    .map(el => {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el);
                            return;
                        }
                    }
                );
                // Update tags
                document.title = to.meta.title || "Avalanche Explorer";
                if (to.meta.metaTags) {
                    to.meta.metaTags
                        .map((tagDef: IMetaTag) => {
                            const tag = document.createElement("meta");
                            Object.keys(tagDef).forEach(key => tag.setAttribute(key, tagDef[key]));
                            tag.setAttribute("vue-router-data", ""); 
                            return tag;
                        })
                        .forEach((tag: HTMLMetaElement) => document.head.appendChild(tag));
                }
            },
            immediate: true
        }
    }
});
</script>

<style scoped lang="scss">
@use"main";
.v-application {
    background-color: main.$gray-xlight !important;
    width: 100vw;
    height: 100vh;
}

.side_container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
}

.content {
    overflow-y: scroll;
}

.router_view {
    box-sizing: border-box;
}

/* ==========================================
   RESPONSIVE
   ========================================== */

.navbarold {
    padding: main.$container_padding_l_old;
}

.router_view,
.footer {
    padding: main.$container_padding_l;
}

@include main.device_l {

    .content {
        padding-top: 160px !important;
    }

    .side_container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    }
    
    .navbarold,
    .router_view {
        padding: main.$container_padding_m_old;
    }

    .footer {
        padding: main.$container_padding_m;
    }
}

@include main.device_m {

    .content {
        padding-top: 124px !important;
    }

    .navbarold,
    .router_view {
        padding: main.$container_padding_s_old;
    }

    .footer {
        padding: main.$container_padding_s;
    }
}


@include main.device_s {

    /* MOBILE NAV */
    
    .router_view {
        padding: main.$container_padding_xs_old;
    }

    .footer {
        padding: main.$container_padding_xs;
    }

    .side_container {
        flex-direction: column;
    }
}

@include main.device_xs {
    
    /* MOBILE NAV */

    .navbarold,
    .router_view  {
        padding: main.$container_padding_xs_old;
    }

    .footer {
        padding: main.$container_padding_xs;
    }
}
</style>

<style lang="scss">
@use "main";
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@500&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap');

/* ==========================================
   typography
   ========================================== */
body {
    font-family: "Rubik", sans-serif;
    margin: 0;
    background-color: main.$white !important;
    color: main.$primary-color;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

button {
    font-family: "Rubik", sans-serif;
    outline: none !important;
    border: none;
    cursor: pointer;
}

p {
    margin: 0;
}

.v-application a {
    color: main.$primary-color !important;
    text-decoration: none;
    font-weight: 400; /* 700 */

    &:hover {
        text-decoration: underline;
    }
}

.v-application .primary--text {
    color: main.$primary-color !important;
    caret-color: main.$primary-color !important;
}

.numeral {
    font-family: "Major Mono Display", sans-serif;
}

/* ==========================================
   layout
   ========================================== */

/* .v-content__wrap {
    height: 100%;
} */

.card {
    background-color: main.$white;
    padding: 20px;
    border-radius: 6px;
}

.header {
    h2 {
        font-size: 26px;
        margin: 0;
        font-weight: 400;
        color: main.$primary-color;
    }
}

@include main.device_s {
    .header {
        h2 {
            font-size: 26px;
            margin: 0;
        }
    }
}

@include main.device_xs {
    .card {
        padding: 30px 15px 30px;
        border-radius: 0;
    }

    .header {
        h2 {
            font-size: 30px;
            margin: 0;
        }
    }
}

/* ==========================================
   detail pages
   ========================================== */

.detail {
    header {
        margin-bottom: 20px;
    }

    a {
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
        color: main.$primary-color;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    > div {
        position: relative;
    }
}

.meta {
    overflow: auto;
    word-break: break-all;
}

.meta_row {
    font-size: 14px;
    display: grid;
    grid-template-columns: 140px 1fr;
    overflow-x: scroll;
    padding: 15px 0;
    border-bottom: 1px solid main.$gray-xlight;
    
    .label {
        font-weight: 400; /* 700 */
        margin-right: 8px;
    }

    &:last-of-type {
        border: none;
    }
}

.genesis_tx {
    display: flex;
    align-items: center;
}

.genesis {
    background-color: #e6ffe6;
    border: 1px solid main.$green;
    color: main.$green;
    width: max-content;
    padding: 4px 8px;
    margin: 0 0 0 30px;
    word-break: keep-all;
}

.status {
    background-color: main.$green-light;
    color: main.$green;
    width: max-content;
    border-radius: 3px;
    padding: 4px 8px;
}

.values {
    span {
        background-color: main.$secondary-color-xlight;
        color: main.$secondary-color;
        margin-right: 4px;
        padding: 4px 8px;
        border-radius: 3px;
    }
}

.id {
    overflow: hidden;
    text-overflow: ellipsis;
}

.utxo_headers,
.io_item {
    grid-template-columns: 120px 80px 80px 1fr 1fr;
}

.utxo_headers {
    display: grid;
    grid-gap: 10px;
    font-size: 12px;

    p {
        font-weight: 400; /* 700 */
        opacity: 0.7;
    }
}

.amount {
    text-align: right;
}

.io_item {
    font-size: 13px;
    padding: 10px 0px;
    overflow: auto;
    border-bottom: 1px solid #f2f2f2;

    &:last-of-type {
        border: none;
    }
}

.outputs {
    overflow: auto;
}

@include main.device_s {
    .meta_row {
        padding: 16px 0;
        grid-template-columns: none;
        grid-template-rows: max-content 1fr;

        .label {
            font-weight: 400; /* 700 */
            margin-bottom: 8px;
            margin-right: 0;
            opacity: 0.7;
        }
    }

    .io {
        grid-template-columns: none;
        grid-template-rows: max-content max-content;
    }

    .utxo_headers,
    .io_item {
        grid-template-columns: 70px 70px 70px 100px 1fr;
    }
}

@include main.device_xs {
    .utxo_table {
        margin-top: 5px;
    }

    .detail {
        padding: main.$container_padding_xs;
    }
}

/* ==========================================
   UI
   ========================================== */
input {
    font-family: 'Rubik', sans-serif;
}

.view_all {
    display: block;
    width: max-content;
    text-decoration: none !important;
    transition: opacity 0.3s;
    
    background-color: transparent!important;
    border-radius: 6px;
    padding: 10px 24px;
    font-family: "DM Sans", sans-serif;
    font-weight: 700 !important;
    letter-spacing: .5px;
    text-transform: uppercase!important;
    font-size: 14px;
    
    &:hover {
        opacity: 0.9;
    }
}

.data_table_header {
    display: flex;
    flex-direction: column;
    width: 100%;

    h3 {
        margin-bottom: 0;
        font-weight: 400;
    }

    .filter_count {
        font-size: 12px;
    }
}

.duration_toggle_container {
    display: flex;
    flex-direction: row-reverse;
}

@include main.device_s {
    .view_all {
        width: 100%;
        text-align: center;
    }
}
/* ==========================================
   vuetify overrides
   ========================================== */

.theme--light.v-breadcrumbs .v-breadcrumbs__divider,
.theme--light.v-breadcrumbs .v-breadcrumbs__item--disabled {
    color: rgba(0, 0, 0, 0.38) !important;
}

.v-breadcrumbs {
    padding: 8px 12px 20px !important;
}

.v-tooltip__content {
    background: rgba(0, 0, 0, 1) !important;
    border: 2px solid rgba(0, 0, 0, 1);
    color: #fff !important;
    border-radius: 4px;
    font-weight: 700;
    font-size: 12px !important;
    line-height: 1.57em !important;
    padding: 8px 16px;
}

@include main.device_l {
    .v-tooltip__content {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}

@include main.device_m {
    .v-tooltip__content {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}

tbody {
    tr:hover {
        background-color: transparent !important;
    }
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;

    .filter_text {
        text-transform: capitalize;
        font-weight: 400;
    }
    
    .filter_input_container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
        max-width: 320px;

        .filter {
            border: 2px solid main.$bg-light;
            background-color: main.$bg-light;
            height: 36px;
            width: 320px;
            box-sizing: content-box;
            border-radius: 2px;
            padding: 8px 12px;
            outline: none;
            font-size: 12px;
            color: main.$primary-color;
        }
    }
}

/* ==========================================
   transitions + animations
   ========================================== */

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

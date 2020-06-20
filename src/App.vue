<template>
    <v-app>
        <nav-bar class="navbar"></nav-bar>
        <v-content class="content">
            <router-view class="router_view"></router-view>
        </v-content>
        <responsive-guidelines></responsive-guidelines>
        <Footer class="footer"></Footer>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
import ResponsiveGuidelines from "./components/misc/ResponsiveGuidelines.vue";
import { IMetaTag } from "@/router/IMetaTag";

export default Vue.extend({
    name: "App",
    components: {
        NavBar,
        ResponsiveGuidelines,
        Footer
    },
    data: () => ({}),
    created(): void {
        this.$store.dispatch("init");
        this.$store.dispatch("Platform/init");
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
                document.title = to.meta.title || "AVA Explorer";
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
    background-color: #f8f8f8 !important;
}

.bg {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;

    img {
        width: 100%;
        object-fit: cover;
        opacity: 0.03;
    }
}

.content {
    position: relative;
}

.router_view {
    box-sizing: border-box;
}

.footer {
    margin-top: 15vh;
}
.navbar,
.router_view,
.footer {
    padding: main.$container_padding_l;
}

@include main.device_l {
    .navbar,
    .router_view,
    .footer {
        padding: main.$container_padding_m;
    }
}

@include main.device_m {
    .navbar,
    .router_view,
    .footer {
        padding: main.$container_padding_s;
    }
}

@include main.device_s {
    .navbar,
    .router_view,
    .footer {
        padding: main.$container_padding_xs;
    }
}

@include main.device_xs {
    .navbar,
    .router_view,
    .footer {
        padding: main.$container_padding_xs;
    }
}
</style>

<style lang="scss">
@use "main";
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@500&display=swap");

/* ==========================================
   typography
   ========================================== */
body {
    font-family: "Helvetica";
    margin: 0;
    background-color: main.$white !important;
    color: main.$black;
}

p {
    margin: 0;
}

.ava-monospace {
    font-family: "Inconsolata", monospace;
    font-size: 1.2em;
}

.v-application a {
    color: main.$primary-color !important;
    text-decoration: none;
    font-weight: normal;

    &:hover {
        text-decoration: underline;
    }
}

.v-application .primary--text {
    color: main.$primary-color !important;
    caret-color: main.$primary-color !important;
}

/* ==========================================
   layout
   ========================================== */

.v-content__wrap {
    min-height: calc(100vh - 130px);
}

.card {
    background-color: main.$white;
    padding: 30px;
    border-radius: 6px;
    box-shadow: main.$box-shadow;
}

.header {
    h2 {
        font-size: 26px;
        margin: 0;
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
        padding: 30px 15px;
    }

    .header {
        h2 {
            font-size: 16px;
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
    font-size: 13px;
    display: grid;
    grid-template-columns: 140px 1fr;
    
    padding: 15px 0;
    border-bottom: 1px solid main.$gray-xlight;
    
    .label {
        font-weight: normal;
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
    margin: 0px 30px;
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
        background-color: main.$primary-color-light;
        color: main.$primary-color;
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
    grid-template-columns: 80px 80px 80px 100px 1fr;
}

.utxo_headers {
    display: grid;
    grid-gap: 10px;

    p {
        font-weight: bold;
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
        font-size: 12px;
        padding: 16px 0;
        grid-template-columns: none;
        grid-template-rows: max-content 1fr;

        .label {
            font-weight: bold;
            margin-bottom: 8px;
            margin-right: 0;
            opacity: 0.7;
        }
    }

    .io {
        grid-template-columns: none;
        grid-template-rows: max-content max-content;
    }
}

@include main.device_xs {
    .detail {
        padding: main.$container_padding_xs;
    }
}

/* ==========================================
   vuetify overrides
   ========================================== */

.theme--light.v-breadcrumbs .v-breadcrumbs__divider,
.theme--light.v-breadcrumbs .v-breadcrumbs__item--disabled {
    color: rgba(0, 0, 0, 0.38) !important;
}

.v-tooltip__content {
    background: #fff !important;
    border: 2px solid rgba(0, 0, 0, 0.87);
    color: rgba(0, 0, 0, 0.87) !important;
    border-radius: 4px;
    font-weight: 700;
    font-size: 12px !important;
    line-height: 1.57em !important;
    padding: 5px 16px;
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

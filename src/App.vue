<template>
    <v-app>
        <!-- <nav-bar-XL class="navbar_xl" v-if="$vuetify.breakpoint.xlOnly"></nav-bar-XL>         -->
        <nav-bar v-if="$vuetify.breakpoint.mdAndUp" class="navbar"></nav-bar>
        <nav-bar-mobile
            v-if="$vuetify.breakpoint.smAndDown"
            class="navbar_mobile"
        ></nav-bar-mobile>
        <div>
            <testnet-alert></testnet-alert>
            <div class="side_container">
                <v-content class="content">
                    <router-view class="router_view"></router-view>
                </v-content>
            </div>
        </div>

        <Footer class="footer"></Footer>
        <notifications></notifications>
        <!-- <ResponsiveGuidelines></ResponsiveGuidelines> -->
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '@/components/NavBar.vue'
import NavBarMobile from '@/components/NavBarMobile.vue'
import TestnetAlert from '@/components/misc/TestnetAlert.vue'
// import ResponsiveGuidelines from "@/components/misc/ResponsiveGuidelines.vue";
import Footer from '@/components/Footer.vue'
import { IMetaTag } from '@/router/IMetaTag'
import Notifications from '@/components/Notifications.vue'

export default Vue.extend({
    name: 'App',
    components: {
        NavBar,
        NavBarMobile,
        // ResponsiveGuidelines,
        TestnetAlert,
        Footer,
        Notifications,
    },
    data: () => ({}),
    watch: {
        $route: {
            handler: (to) => {
                // Remove stale tags from the document using key attribute
                Array.from(document.querySelectorAll('[vue-router-data]')).map(
                    (el) => {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el)
                            return
                        }
                    }
                )
                // Update tags
                document.title = to.meta.title || 'Avalanche Explorer'
                if (to.meta.metaTags) {
                    to.meta.metaTags
                        .map((tagDef: IMetaTag) => {
                            const tag = document.createElement('meta')
                            Object.keys(tagDef).forEach((key) =>
                                tag.setAttribute(key, tagDef[key])
                            )
                            tag.setAttribute('vue-router-data', '')
                            return tag
                        })
                        .forEach((tag: HTMLMetaElement) =>
                            document.head.appendChild(tag)
                        )
                }
            },
            immediate: true,
        },
    },
    async created() {
        this.$store.dispatch('init')
        this.$store.dispatch('Platform/init')
        await this.$store.dispatch('Network/init')
    },
})
</script>

<style scoped lang="scss">
.v-application {
    background-color: $gray-xlight !important;
    min-height: 100vh;
}

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    .v-application {
        background-color: #fff !important;
        background-image: $background_image;
    }
}

.side_container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
}

.content {
    min-height: 100vh;
    overflow-y: scroll;
}

.router_view {
    box-sizing: border-box;
}

/* ==========================================
   RESPONSIVE
   ========================================== */

@include xlOnly {
    .navbar,
    .router_view,
    .footer {
        padding: $container_padding_xl;
    }

    .side_container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    }

    .content {
        padding: $container_padding_xl;
        padding-top: 0 !important;

        @if $VUE_APP_DEFAULT_NETWORKID == 1 {
            padding-top: $navbar_height_offset_xl !important;
        }
    }
}

@include lgOnly {
    .navbar,
    .router_view,
    .footer {
        padding: $container_padding_lg;
    }

    .content {
        padding-top: 0 !important;

        @if $VUE_APP_DEFAULT_NETWORKID == 1 {
            padding-top: $navbar_height_offset_lg !important;
        }
    }
}

@include mdOnly {
    .navbar,
    .router_view,
    .footer {
        padding: $container_padding_md;
    }

    .content {
        padding-top: 0 !important;

        @if $VUE_APP_DEFAULT_NETWORKID == 1 {
            padding-top: $navbar_height_offset_md !important;
        }
    }
}

@include smOnly {
    .side_container {
        flex-direction: column;
    }
    .router_view,
    .footer {
        padding: $container_padding_sm;
        padding-top: 0 !important;
    }
    .content {
        padding-top: 0 !important;

        @if $VUE_APP_DEFAULT_NETWORKID == 1 {
            padding-top: $navbar_height_offset_sm !important;
        }
    }
}

@include xsOnly {
    .router_view,
    .footer {
        padding: $container_padding_xs;
        padding-top: 0 !important;
    }

    .content {
        padding-top: 0 !important;

        @if $VUE_APP_DEFAULT_NETWORKID == 1 {
            padding-top: $navbar_height_offset_xs !important;
        }
    }
}
</style>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;200;300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@1,400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');

/* ==========================================
   typography
   ========================================== */
body {
    font-family: 'Rubik', sans-serif;
    margin: 0;
    background-color: $white !important;
    color: $primary-color;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.monospace {
    font-family: 'Roboto Mono', monospace;
}

button {
    font-family: 'Rubik', sans-serif;
    outline: none !important;
    border: none;
    cursor: pointer;
}

p {
    margin: 0;
}

.v-application a {
    color: $primary-color !important;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

.v-application .primary--text {
    color: $primary-color !important;
    caret-color: $primary-color !important;
}

/* ==========================================
   layout
   ========================================== */

.v-content__wrap {
    min-height: calc(100vh - #{$navbar_height_offset_xl});
}

.card {
    background-color: $white;
    padding: 30px;
    border-radius: 6px;
}

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    .card {
        border: 2px solid $blue;
    }
}

.header {
    h2 {
        font-size: 26px;
        margin: 0;
        font-weight: 400;
        color: $primary-color;
    }
}

@include smOnly {
    .header {
        h2 {
            font-size: 26px;
            margin: 0;
        }
    }
}

@include xsOnly {
    .card {
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
        color: $primary-color;
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
    border-bottom: 1px solid $gray-xlight;

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
    border: 1px solid $green;
    color: $green;
    width: max-content;
    padding: 4px 8px;
    margin: 0 0 0 30px;
    word-break: keep-all;
}

.status {
    background-color: $green-xlight;
    color: $green;
    width: max-content;
    border-radius: 3px;
    padding: 4px 8px;
}

.values {
    span {
        background-color: $secondary-color-xlight;
        color: $secondary-color;
        margin-right: 4px;
        padding: 4px 8px;
        border-radius: 3px;
    }
}

.id {
    overflow: hidden;
    text-overflow: ellipsis;
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

@include xsOnly {
    .utxo_table {
        margin-top: 5px;
    }

    .detail {
        padding: $container_padding_xs;
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

    background-color: transparent !important;
    border-radius: 6px;
    padding: 10px 24px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700 !important;
    letter-spacing: 0.5px;
    text-transform: uppercase !important;
    font-size: 14px;

    &:hover {
        opacity: 0.7;
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

.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -4px;
    margin-right: 8px;
    vertical-align: middle;
}

.duration_toggle_container {
    display: flex;
    flex-direction: row-reverse;
}

.tx_chain_header {
    display: flex;
    justify-content: space-between;
}

.chain {
    font-size: 12px;
    color: $primary-color-light;
    text-align: right;
    flex-grow: 1;

    .label {
        padding: 4px 12px 4px 0;
        min-height: 1em;
        line-height: 2em;
    }

    .tag {
        padding: 4px 12px;
        border-radius: 4px;
        color: $secondary-color;
        background-color: $secondary-color-xlight;
        min-height: 1em;
        line-height: 2em;
        word-break: keep-all;
        white-space: nowrap;
    }
}

@include smOnly {
    .view_all {
        width: 100%;
        text-align: center;
    }
}
/* ==========================================
   vuetify overrides
   ========================================== */

.ava_btn {
    transition: opacity 0.3s;
    background-color: transparent !important;
    border-radius: 6px;
    padding: 10px 24px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700 !important;
    letter-spacing: 0.5px;
    text-transform: uppercase !important;
    font-size: 14px !important;
    height: 38px;

    &:hover {
        opacity: 0.9;
    }
}

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
            border: 2px solid $bg-light;
            background-color: $bg-light;
            height: 36px;
            width: 320px;
            box-sizing: content-box;
            border-radius: 2px;
            padding: 8px 12px;
            outline: none;
            font-size: 12px;
            color: $primary-color;
        }
    }
}

.theme--light.v-input input,
.theme--light.v-input textarea {
    border: none;
}

.v-toolbar--dense .v-toolbar__content,
.v-toolbar--dense .v-toolbar__extension {
    padding: 0;
}

@include xlOnly {
    .v-toolbar--dense .v-toolbar__content,
    .v-toolbar--dense .v-toolbar__extension {
        padding: 0;
    }
}

/* ==========================================
   Data Viz
   ========================================== */
.chart_toggle_settings {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 2px 0 20px;

    button {
        flex-grow: 1;
        font-size: 9px;
        background-color: transparent;
        color: $primary-color;
        height: 24px;
        width: 28px;
        border: none;
        margin-left: 3px;
        outline: none;
        border-radius: 2px;
        padding: 1px 3px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer;

        &:hover {
            opacity: 0.7;
        }

        &[active] {
            color: $white;
            background-color: $primary-color;
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

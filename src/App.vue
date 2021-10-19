<template>
    <v-app>
        <NavBar v-if="$vuetify.breakpoint.mdAndUp" class="navbar" />
        <NavBarMobile
            v-if="$vuetify.breakpoint.smAndDown"
            class="navbar_mobile"
        />
        <div>
            <TestnetAlert />
            <div class="side_container">
                <v-content class="content">
                    <router-view class="router_view"></router-view>
                </v-content>
            </div>
        </div>

        <Footer class="footer" />
        <Notifications />
        <!-- <ResponsiveGuidelines /> -->
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '@/components/NavBar.vue'
import NavBarMobile from '@/components/NavBarMobile.vue'
import TestnetAlert from '@/components/misc/TestnetAlert.vue'
// import ResponsiveGuidelines from '@/components/misc/ResponsiveGuidelines.vue'
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
    background-color: $white !important;
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
}

.router_view {
    box-sizing: border-box;
}

/* ==========================================
   RESPONSIVE
   ========================================== */

@include lgOrBigger {
    .navbar,
    .router_view {
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

        // @if $VUE_APP_DEFAULT_NETWORKID == 1 {
        //     padding-top: $navbar_height_offset_xl !important;
        // }
    }
}

@include lgOnly {
    .navbar,
    .router_view {
        padding: $container_padding_lg;
    }

    .content {
        padding-top: 0 !important;

        // @if $VUE_APP_DEFAULT_NETWORKID == 1 {
        //     padding-top: $navbar_height_offset_lg !important;
        // }
    }
}

@include mdOnly {
    .navbar,
    .router_view {
        padding: $container_padding_md;
    }

    .content {
        padding-top: 0 !important;

        // @if $VUE_APP_DEFAULT_NETWORKID == 1 {
        //     padding-top: $navbar_height_offset_md !important;
        // }
    }
}

@include smOnly {
    .side_container {
        flex-direction: column;
    }
    .router_view {
        padding: $container_padding_sm;
        padding-top: 0 !important;
    }

    .content {
        padding-top: 0 !important;

        // @if $VUE_APP_DEFAULT_NETWORKID == 1 {
        //     padding-top: $navbar_height_offset_sm !important;
        // }
    }
}

@include xsOrSmaller {
    @if $VUE_APP_DEFAULT_NETWORKID == 5 {
        .v-application {
            background-image: none !important;
        }
    }

    .router_view {
        padding: $container_padding_xs;
        padding-top: 0 !important;
    }

    .content {
        padding-top: 0 !important;

        // @if $VUE_APP_DEFAULT_NETWORKID == 1 {
        //     padding-top: $navbar_height_offset_xs !important;
        // }
    }
}
</style>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;700&display=swap');

:root {
    // color
    --c-detail: hsl(0, 0%, 90%);
    --c-gray: hsl(0, 0%, 93%);
    // font
    --f-size: 15px;
    --f-height: 24px;
    --f-height-mono: 20px;
    --f-weight: 400;
    --f-scale-s: 0.87;
    --f-scale-m: 1.2;
    --f-scale-l: 2.618;
    // animation
    --a-speed: 150ms;
    --a-ease: ease-out;
    // layout
    --l-padding: 1rem;
}

body {
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.0143007em;
    font-size: var(--f-size);
    line-height: var(--f-height);
    font-weight: var(--f-weight);
}

.monospace {
    font-family: 'Roboto Mono', monospace;
    line-height: var(--f-height-mono);
}

button {
    font-family: 'Inter', sans-serif;
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

th {
    font-weight: 500;
}

.header {
    h2 {
        font-size: 22px;
        margin: 0;
        font-weight: 500;
        color: $primary-color;
        word-break: break-all;
    }
}

@include smOrBigger {
    .header {
        h2 {
            font-size: 30px;
        }

        .top_info_heading {
            font-size: 22px;
            word-break: break-word;
        }
    }
}

@include smOrSmaller {
    .header {
        h2 {
            font-size: calc(var(--f-size) * var(--f-scale-m));
        }
    }
}

body {
    margin: 0;
    color: $primary-color;
    background-color: $white !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

p {
    margin: 0;
}

button {
    outline: none !important;
    border: none;
    cursor: pointer;
}

.v-content__wrap {
    min-height: calc(100vh - #{$navbar_height_offset_xl});
}

.card {
    background-color: $white;
    padding: 30px;
    border-radius: 20px;
    border: 1px solid $gray-light;
}

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    .card {
        border: 2px solid $blue;
    }
}

.stats {
    dl {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        flex-grow: 1;
        justify-content: flex-start;
        margin: 0;

        dd {
            text-transform: capitalize;
            font-size: 12px;
            margin-inline-start: 0;
            margin-bottom: 6px;

            &.indent {
                padding-left: 3px;
            }
        }

        dt {
            font-size: 20px;
            line-height: 1em;

            .unit {
                font-size: 12px;
            }
        }
    }
}

@include smOrSmaller {
    .card {
        margin: 2rem 0 0;
    }

    .stats {
        dl {
            padding: 18px 0;
            border-bottom: 1px solid var(--c-gray);

            dd {
                padding: 0;
                margin-bottom: 0;
                font-variation-settings: 'wght' 650;
                font-size: var(--f-size);
                line-height: var(--f-height);

                &.indent {
                    padding-left: 0;
                }
            }

            dt {
                font-size: var(--f-size);
                line-height: var(--f-height);

                .unit {
                    font-size: 15px !important;
                }
            }
        }
    }
}

@include xsOrSmaller {
    .card {
        padding-left: 0;
        padding-right: 0;
        border-radius: 0;
        border: none;
    }
}

/* ==========================================
   UI
   ========================================== */
input {
    font-family: 'Inter', sans-serif;
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
        padding: 10px 0 0 16px;
        font-size: 12px;
        font-weight: 400;
    }
}

.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -1px;
    margin-right: 14px;
    vertical-align: middle;
}

.duration_toggle_container {
    display: flex;
    flex-direction: row-reverse;
}

.chain {
    font-size: 12px;
    color: $primary-color-light;
    flex-grow: 1;

    .label {
        padding: 4px 12px 4px 0;
        min-height: 1em;
        line-height: 2em;
    }
}

.chain_tag {
    padding: 4px 12px;
    border-radius: 12px;
    color: $primary-color;
    background-color: $white;
    min-height: 1em;
    line-height: 2em;
    word-break: keep-all;
    white-space: nowrap;
}

/* ==========================================
   vuetify overrides
   ========================================== */

.ava_btn {
    transition: opacity 0.3s;
    background-color: transparent !important;
    border-radius: 6px;
    padding: 10px 24px;
    font-family: 'Inter', sans-serif;
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

@include smOrSmaller {
    .v-breadcrumbs {
        padding: 8px 0 0 !important;
    }
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

    .light {
        font-weight: 300;
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
            border: 2px solid $background-color;
            background-color: $background-color;
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
    flex-direction: column;
}

@include lgOrBigger {
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
    justify-content: space-between;
    margin: 2px 0 20px;

    button {
        font-size: 9px;
        background-color: transparent;
        color: $button;
        height: 24px;
        width: 50px;
        border: none;
        margin-left: 3px;
        outline: none;
        border: 1px solid $button;
        border-radius: 12px;
        padding: 4px 3px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer;

        &:hover {
            opacity: 0.7;
        }

        &[active] {
            color: $white;
            background-color: $button;
            border: 1px solid $button;
        }
    }
}

/* ==========================================
   transitions + animations
   ========================================== */

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1), ease;
}

.fade-enter, 
.fade-leave-to 
/* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>

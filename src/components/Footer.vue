<template>
    <v-footer color="#FFF">
        <div class="footer_container">
            <div class="powered_by">
                <div class="header">
                    <img :src="img" />
                    <h4>Avalanche Explorer</h4>
                </div>
                <p class="avalanche_desc">
                    Avalanche Explorer is an analytics tool that enables people
                    to search the Avalanche blockchain for transactions,
                    addresses, and other platform activities.
                </p>
                <p class="avalanche_desc tos">
                    By using this application you agree to the
                    <a
                        href="/Avalanche (BVI) Inc. Explorer Terms of Use.pdf"
                        target="_blank"
                        >Terms of Use</a
                    >.
                </p>
            </div>
            <div class="lists">
                <div class="list">
                    <h4>Menu</h4>
                    <a :href="cChainURL">Home</a>
                    <router-link to="/subnets">Subnets</router-link>
                    <router-link to="/validators">Validators</router-link>
                    <router-link to="/assets">Assets</router-link>
                    <router-link to="/blockchains">Blockchains</router-link>
                    <a :href="cChainURL">C-Chain</a>
                    <a :href="statusPageURL">Status</a>
                    <router-link to="/resources">Resources</router-link>
                </div>
                <div class="list">
                    <h4>Social</h4>
                    <a href="https://twitter.com/avalancheavax" target="_blank">
                        <fa :icon="['fab', 'twitter']"></fa>Twitter
                    </a>
                    <a href="https://chat.avax.network" target="_blank">
                        <fa :icon="['fab', 'discord']"></fa>Discord
                    </a>
                    <a href="https://reddit.com/r/avax" target="_blank">
                        <fa :icon="['fab', 'reddit']"></fa>Reddit
                    </a>
                    <a href="https://github.com/ava-labs/avalanche-explorer" target="_blank">
                        <fa :icon="['fab', 'github']"></fa>GitHub
                    </a>
                </div>
            </div>
        </div>
    </v-footer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {
    DEFAULT_NETWORK_ID,
    cChainExplorerURL,
    cChainExplorerURL_test,
    statusURL,
    statusURL_test,
} from '@/store/modules/network/network'

@Component({})
export default class Footer extends Vue {
    get cChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? cChainExplorerURL
            : cChainExplorerURL_test
    }

    get statusPageURL() {
        return DEFAULT_NETWORK_ID === 1 ? statusURL : statusURL_test
    }

    get img() {
        const color = DEFAULT_NETWORK_ID === 1 ? `black` : `blue`
        return `/img/ava_logo_${color}.png`
    }
}
</script>

<style scoped lang="scss">
$footer_color: $black;

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    $footer_color: $secondary-color;
}

.v-footer {
    margin: 60px 0 0 0;
    padding: 0 !important;
    color: $footer_color !important;
    font-weight: 500;
}

.footer_container {
    width: 100%;
    padding-top: 40px;
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h4 {
        margin-top: 12px;
    }
}

.powered_by {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 415px;

    .header {
        display: flex;
        align-items: center;
        font-size: 24px;

        h4 {
            margin: 0;
        }

        img {
            width: auto;
            margin-right: 10px;
            height: 30px;
            object-fit: contain;
        }
    }

    p {
        margin: 24px 0px;
        font-size: 14px;
    }

    .tos {
        margin-top: 0;
        margin-bottom: 48px;

        a {
            color: $footer_color !important;
            text-decoration: underline;
        }
    }
}

.avalanche_desc {
    line-height: 1.5em;
}

.lists {
    display: flex;
    flex-direction: row;
}

.list {
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    font-size: 14px;
    width: 150px;

    &:first-of-type {
        margin-right: 70px;
    }

    &:last-of-type {
        margin: 0;
    }

    h4 {
        padding-top: 0;
        padding-bottom: 8px;
        border-bottom: 2px solid $footer_color;
        margin-bottom: 30px;
        font-size: 14px !important;
    }

    a {
        color: $footer_color !important;
        margin-bottom: 21px;
        text-decoration: none;

        svg {
            font-size: 16px;
            margin-right: 8px;
        }
    }
}

.footer_container {
    border-top: 2px solid $footer_color;
}

@include lgOrBigger {
    .footer_container {
        padding: $container_padding_xl;
    }
}

@include lgOnly {
    .footer_container {
        padding: $container_padding_lg;
        padding-top: 40px !important;
    }
}

@include mdOnly {
    .footer_container {
        padding: $container_padding_md;
        padding-top: 40px !important;
    }
}

@include smOnly {
    .footer_container {
        padding: $container_padding_sm;
        padding-top: 40px !important;

        flex-direction: column;
        justify-content: flex-start;
    }

    .lists {
        width: 100%;
    }

    .list {
        width: 100%;
        flex-basis: 1;
    }

    .list:first-of-type {
        margin-right: 30px;
    }
}

@include xsOrSmaller {
    .footer_container {
        padding: $container_padding_xs;
        padding-top: 40px !important;

        flex-direction: column;
        justify-content: flex-start;
    }

    .lists {
        width: 100%;
    }

    .list {
        width: 100%;
        flex-grow: 1;
    }

    .list:first-of-type {
        margin-right: 30px;
    }
}
</style>

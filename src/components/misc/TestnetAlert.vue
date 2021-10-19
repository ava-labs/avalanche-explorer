<template>
    <div>
        <template v-if="networkID === 1">
            <v-alert
                id="mainnet_announce"
                class="testnet_alert mainnet_announcement"
                text
                rounded="0"
            >
                <p class="description">
                    Explore network activity and staking metrics using
                    <a class="bold" :href="statsURL">Avalanche Stats</a>.
                </p>
            </v-alert>
        </template>
        <template v-else>
            <v-alert class="testnet_alert" text type="info" rounded="0">
                <p class="description">
                    Notice: This Explorer displays activity on the
                    {{ networkName }} Testnet, <span class="bold">not</span> the
                    Avalanche Mainnet.
                </p>
            </v-alert>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import {
    DEFAULT_NETWORK_ID,
    DEFAULT_NETWORK_NAME,
} from '@/store/modules/network/network'

@Component({})
export default class TestnetAlert extends Vue {
    get networkID(): number {
        return DEFAULT_NETWORK_ID
    }

    get networkName(): string {
        return DEFAULT_NETWORK_NAME
    }

    get statsURL() {
        return 'https://stats.avax.network/'
    }
}
</script>

<style scoped lang="scss">
.testnet_alert {
    margin-top: 140px !important;
    background-color: $white !important;
}

#mainnet_announce {
    > .v-alert__wrapper {
        .info--text {
            color: $white !important;
            caret-color: #fff !important;
        }
    }

    .bold {
        color: $white !important;
    }
}
.mainnet_announcement {
    color: $white !important;
    font-weight: 500;
    background-image: linear-gradient(to left, #2196f3) !important;

    .description {
        color: #fff !important;
        caret-color: #fff !important;
        text-align: center;
    }
}

@if $VUE_APP_DEFAULT_NETWORKID == 1 {
    .v-alert--text:before {
        background-color: $white;
    }
}

.bold {
    font-weight: 700;
    text-decoration: underline;
}

@include lgOrBigger {
    .testnet_alert {
        margin-top: $navbar_height_offset_xl !important;
        padding-left: 18vw;
        padding-right: 18vw;
    }
}

@include lgOnly {
    .testnet_alert {
        padding-left: 8vw;
        padding-right: 8vw;
    }
}

@include mdOnly {
    .testnet_alert {
        padding-left: 15px;
        padding-right: 15px;
    }
}

@include smOnly {
    .testnet_alert {
        margin-top: 0px !important;
        padding-left: 15px;
        padding-right: 15px;
    }
}

@include xsOrSmaller {
    .testnet_alert {
        margin-top: 0px !important;
        padding-left: 15px;
        padding-right: 15px;
    }
}
</style>

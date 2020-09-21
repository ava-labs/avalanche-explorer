<template>
    <div>
        <template v-if="networkID === 0">
            <v-alert class="testnet_alert" text type="warning" rounded="0">
                <p class="description">Notice: This Testnet Explorer does not reflect Avalanche's Mainnet, its genesis state, or any network activity. Data here is reflective of the Fuji test network.</p>
            </v-alert>
        </template>
        <template v-else>
            <v-alert class="testnet_alert" text type="info" rounded="0">
                <p class="description">Notice: This Testnet Explorer does not reflect Avalanche's Mainnet, its genesis state, or any network activity. Data here is reflective of the Fuji test network.</p>
            </v-alert>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import { DEFAULT_NETWORK_ID } from "@/store/modules/network/network";

@Component({})
export default class TestnetAlert extends Vue {
    get networkID(): number {
        return DEFAULT_NETWORK_ID;
    }
}
</script>

<style scoped lang="scss">
.testnet_alert {
    margin-top: 100px !important;
    background-color: $white !important;
}

@include xlOnly {
    .testnet_alert {
        margin-top: $navbar_height_offset_xl !important;
        padding-left: 18vw;
        padding-right: 18vw;
    }
}

@include lgOnly {
    .testnet_alert {
        padding-left: 8vw;
        padding-right: s8vw;
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

@include xsOnly {
    .testnet_alert {
        margin-top: 0px !important;
        padding-left: 15px;
        padding-right: 15px;
    }
}
</style>

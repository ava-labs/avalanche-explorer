<template>
    <div>
        <template v-if="networkID === 1">
            <v-alert class="testnet_alert mainnet_announcement" rounded="0">
                <p class="description">Per consensum ad astra</p>
            </v-alert>
        </template>
        <template v-else>
            <v-alert class="testnet_alert" text type="info" rounded="0">
                <p class="description">Notice: This Explorer displays activity on the {{networkName}} Testnet, <span class="bold">not</span> the Avalanche Mainnet.</p>
            </v-alert>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import { DEFAULT_NETWORK_ID, DEFAULT_NETWORK_NAME } from "@/store/modules/network/network";

@Component({})
export default class TestnetAlert extends Vue {
    get networkID(): number {
        return DEFAULT_NETWORK_ID;
    }

    get networkName(): string {
        return DEFAULT_NETWORK_NAME;
    }
}
</script>

<style scoped lang="scss">
.testnet_alert {
    margin-top: 100px !important;
    background-color: $white !important;
}

.mainnet_announcement {
    color: $white !important;
    font-weight: 400;
    font-style: italic;
    background-image: linear-gradient(to left, #ff8080, #f6a06a, #debf6f, #c2da8f, #a9efbf) !important;

    .description {
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

@include xsOnly {
    .testnet_alert {
        margin-top: 0px !important;
        padding-left: 15px;
        padding-right: 15px;
    }
}
</style>

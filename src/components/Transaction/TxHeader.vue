<template>
    <div class="header">
        <h2>Transactions</h2>
        <v-alert class="testnet_alert" text type="info" rounded="0">
            <p class="description">
                Notice: This explorer only indexes the X-Chain and P-Chain. To
                view C-Chain transactions (EVM chain), click
                <a class="bold c_chain_link" :href="cChainURL">here</a>.
            </p>
        </v-alert>
        <p class="chain">
            <span class="label">You are viewing transactions for</span>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                    <span
                        class="chain_tag"
                        :style="{
                            backgroundColor: pChain.darkColor,
                        }"
                        v-on="on"
                        >{{ pChain.name }}</span
                    >
                </template>
                <span
                    >The P-Chain is the metadata blockchain on Avalanche,
                    managing validators and custom subnets. Validators stake
                    AVAX on the P-Chain to secure the network.</span
                >
            </v-tooltip>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                    <span
                        class="chain_tag margin-left"
                        :style="{
                            backgroundColor: xChain.darkColor,
                        }"
                        v-on="on"
                        >{{ xChain.name }}</span
                    >
                </template>
                <span
                    >The X-Chain is the default asset blockchain on Avalanche
                    enabling the creation and instant exchange of assets. This
                    blockchain is for transfers that benefit from
                    high-throughput and instant finality. Think X for eXchanging
                    assets.
                </span>
            </v-tooltip>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                    <span
                        class="chain_tag margin-left"
                        :style="{
                            backgroundColor: cChain.darkColor,
                        }"
                        v-on="on"
                        >{{ cChain.name }} (atomic txs only)</span
                    >
                </template>
                <span
                    >The C-Chain is the default smart contract blockchain on
                    Avalanche and enables the creation of any
                    Ethereum-compatible applications and assets with lower fees
                    and faster transactions.</span
                >
            </v-tooltip>
        </p>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import { P, X, C, getTxChainType } from '@/known_blockchains'
import {
    DEFAULT_NETWORK_ID,
    cChainExplorerURL,
    cChainExplorerURL_test,
} from '@/store/modules/network/network'

@Component({})
export default class TxHeader extends Vue {
    get xChain() {
        return getTxChainType(X.id)
    }

    get pChain() {
        return getTxChainType(P.id)
    }

    get cChain() {
        return getTxChainType(C.id)
    }

    get cChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? cChainExplorerURL
            : cChainExplorerURL_test
    }
}
</script>
<style scoped lang="scss">
.testnet_alert {
    background-color: $white !important;
}

@if $VUE_APP_DEFAULT_NETWORKID == 1 {
    .v-alert--text:before {
        background-color: $white;
    }
}

.bold {
    font-weight: 700;
}

.margin-left {
    margin-left: 10px;
}

.refresh {
    margin-left: 16px;
}

.ava-btn-label {
    padding-left: 8px;
}

.c_chain_link {
    color: #2196f3 !important;
    text-decoration: underline;
}

.header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;

    h2 {
        padding-bottom: 10px;
    }

    .refresh {
        color: $primary-color;
        text-transform: none;
        border: none;
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
    }

    .right {
        flex-grow: 1;
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-end;
    }
}
@include smOnly {
    .header {
        padding-bottom: 0;

        .right {
            display: none;
        }
    }
}

@include xsOrSmaller {
    .header {
        display: flex;
        flex-direction: column;

        .left {
            display: flex;
            width: 100%;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .right {
            padding: 15px 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
        }
    }
}
</style>

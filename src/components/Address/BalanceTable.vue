<template>
    <div class="balances_container">
        <div class="bar">
            <p class="count">{{Object.keys(assets).length | pluralize}} found</p>
        </div>
        <div v-if="assets.length > 0" class="grid_headers balance_row">
            <p>
                Symbol
                <Tooltip content="An arrangement of letters representing an asset"></Tooltip>
            </p>
            <p class="name">
                Name
                <Tooltip content="Name for the asset"></Tooltip>
            </p>
            <p class="balance">
                <Tooltip content="Balance held by this address"></Tooltip>Balance
            </p>
            <p class="sent">
                <Tooltip content="Total sent by this address"></Tooltip>Sent
            </p>
            <p class="received">
                <Tooltip content="Total received by this address"></Tooltip>Received
            </p>
            <p class="txs">
                <Tooltip content="Total transactions involving this address"></Tooltip>Txs
            </p>
            <p class="utxos">
                <Tooltip content="Total UTXOs involving this address"></Tooltip>UTXOs
            </p>
        </div>
        <BalanceRow v-for="(asset, index) in assets" v-bind:key="index" :asset="asset"></BalanceRow>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import Tooltip from "@/components/rows/Tooltip.vue";
import BalanceRow from "@/components/Address/BalanceRow.vue";
import { IBalance } from "@/js/IAddress";

@Component({
    components: {
        Tooltip,
        BalanceRow
    },
    filters: {
        pluralize(val: number): string {
            return val === 0
                ? `${val} assets`
                : val > 1
                ? `${val} assets`
                : `${val} asset`;
        }
    }
})
export default class BalanceTable extends Vue {
    @Prop() assets!: IBalance[];
}
</script>

<style scoped lang="scss">
@use "../../main";

.balances_container {
    overflow-x: scroll;

    .count {
        margin-bottom: 12px;
    }

    .grid_headers {
        font-weight: 500;
        font-size: 12px;
    }

    .balance,
    .sent,
    .received,
    .txs,
    .utxos {
        text-align: right;
    }

    .grid_headers {
        .balance,
        .sent,
        .received {
            padding-right: 44px;
        }
    }

    .balance_row {
        display: grid;
        grid-template-columns: 60px 1fr 225px 225px 225px 75px 75px;
        padding: 10px 0;
        border-bottom: 1px solid #e7e7e7;
        column-gap: 10px;

        > * {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        &:last-of-type {
            border: none;
        }
    }
}

@include main.mdOnly {
    .balances_container {
        .balance_row {
            grid-template-columns: 60px 100px 225px 225px 225px 75px 75px;
        }
    }
}

@include main.smOnly {
    .balances_container {
        .balance_row {
            grid-template-columns: 50px 100px 225px 225px 225px 75px 75px;
        }
    }
}
</style>

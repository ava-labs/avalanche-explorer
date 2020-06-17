<template>
    <div class="balance_row">
        <p v-if="asset.symbol" class="symbol">{{asset.symbol}}</p>
        <p v-else class="no_symbol"></p>
        <router-link class="name_id" :to="`/asset/${asset.id}`">{{asset | nameOrID}}</router-link>
        <p class="balance">{{asset.balance.toLocaleString()}}</p>
        <p class="received">{{asset.totalReceived.toLocaleString()}}</p>
        <p class="sent">{{asset.totalSent.toLocaleString()}}</p>
        <p class="txs">{{asset.transactionCount.toLocaleString()}}</p>
        <p class="utxos">{{asset.utxoCount.toLocaleString()}}</p>
    </div>
</template>
<script>
import { stringToBig } from "../../helper";
import { blockchainMap } from "@/helper";

export default {
    props: {
        asset: {
            type: Object,
            required: true
        }
    },
    filters: {
        blockchain(val) {
            return blockchainMap(val);
        },
        nameOrID(val) {
            return val.name ? val.name : val.id;
        }
    },
    computed: {
        supply() {
            return stringToBig(
                this.asset.currentSupply,
                this.asset.denomination
            ).toFixed(this.asset.denomination);
        },
        avgTxValue() {
            return this.asset.txCount_day > 0
                ? (this.asset.volume_day / this.asset.txCount_day).toFixed(0)
                : "";
        }
    }
};
</script>
<style scoped lang="scss">
@use"../../main";

.balance_row {
    font-weight: 400;
    > * {
        align-self: center;
    }

    > div {
        display: flex;
    }

    p {
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
    }

    a {
        color: main.$black !important;
    }
}

.symbol {
    color: main.$purple;
    background-color: main.$purple-light;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
    font-weight: 700;
}

.no_symbol {
    color: transparent;
    background-color: transparent;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
}

.name_id {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
}

.balance,
.sent,
.received,
.txs,
.utxos {
    text-align: right;
}

.supply {
    span {
        display: inline-block;
        width: 43px;
        opacity: 0.4;
        text-align: left;
        padding-left: 4px;
    }
}

@include main.device_s {
    .symbol {
        padding: 2px;
    }

    .name_id {
        grid-column: 2/4;
    }

    .supply {
        grid-column: 1/4;
        text-align: right;
    }
}
</style>

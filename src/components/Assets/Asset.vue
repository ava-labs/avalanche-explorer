<template>
    <div class="asset_row">
        <p v-if="asset.symbol" class="symbol">{{asset.symbol}}</p>
        <p v-else class="no_symbol"></p>
        <router-link class="name_id" :to="`/asset/${asset.id}`">{{asset | nameOrID}}</router-link>
        <p class="volume_day">{{asset.volume_day}}</p>
        <p class="txCount_day">{{asset.txCount_day}}</p>
        <p class="avgTx_day">{{avgTxValue}}</p>
        <!-- <p class="denomination">{{asset.denomination}}</p> -->
        <p class="supply">{{supply}} <span>{{asset.symbol}}</span></p>
        <p class="chain">{{asset.chainID | blockchain}}</p>
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
            return val.name? val.name :val.id;
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
            return (this.asset.txCount_day > 0) ? (this.asset.volume_day / this.asset.txCount_day).toFixed(0) : "";
        }
    }
};
</script>
<style scoped lang="scss">
@use"../../main";

.asset_row {
    font-weight: 700;
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
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
}

.data_col {
    display: flex;
    flex-direction: column;
}

.chain {
    padding-left: 20px;
}

.volume_day,
.txCount_day,
.avgTx_day,
.denomination,
.supply {
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

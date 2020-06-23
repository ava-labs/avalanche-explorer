<template>
    <div class="asset_row">
        <p v-if="asset.symbol && $vuetify.breakpoint.smAndUp" class="symbol">{{asset.symbol}}</p>
        <p v-if="!asset.symbol && $vuetify.breakpoint.smAndUp" class="no_symbol"></p>
        <router-link class="name_id" :to="`/asset/${asset.id}`">{{asset | nameOrID}}</router-link>
        <p class="volume_day">
            {{asset.volume_day.toLocaleString()}} 
            <span class="unit" v-if="$vuetify.breakpoint.xs">{{asset.symbol}}</span>
        </p>
        <p class="txCount_day" v-if="$vuetify.breakpoint.smAndUp">{{asset.txCount_day.toLocaleString()}}</p>
        <p class="avgTx_day" v-if="$vuetify.breakpoint.smAndUp">{{avgTxValue}}</p>
        <!-- <p class="denomination" v-if="$vuetify.breakpoint.smAndUp">{{asset.denomination}}</p> -->
        <p class="supply" v-if="$vuetify.breakpoint.smAndUp">{{asset.currentSupply.toLocaleString(asset.denomination)}} <span>{{asset.symbol}}</span></p>
        <p class="chain" v-if="$vuetify.breakpoint.smAndUp">{{asset.chainID | blockchain}}</p>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { stringToBig, blockchainMap } from "@/helper";
import { Asset } from "@/js/Asset";
import Big from "big.js";

@Component({
    filters: {
        blockchain(val: string): string {
            return blockchainMap(val);
        },
        nameOrID(val: Asset): string {
            return val.name? val.name :val.id;
        }
    },
})

export default class AssetRow extends Vue {
    @Prop() asset!: Asset;
        
    get avgTxValue(): string {
        return (this.asset.txCount_day > 0) ? parseInt((this.asset.volume_day / this.asset.txCount_day).toFixed(0)).toLocaleString() : "";
    }

}
</script>

<style scoped lang="scss">
@use"../../main";

.asset_row {
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

@include main.device_xs {
    .asset_row {
        a {
            color: main.$primary-color !important;
        }

        .unit {
            padding-left: 3px;
            min-width: 30px;
            display: inline-block;
            text-align: left;
            color: main.$gray;
            opacity: 0.7;
            font-size: 9px;
        }
    }

    .symbol {
        padding: 2px;
    }

    .name_id {
        grid-column: 1/2;
    }

    .supply {
        grid-column: 2/2;
        text-align: right;
    }
}
</style>

<template>
    <div class="asset_row">
        <p v-if="asset.symbol && $vuetify.breakpoint.smAndUp" class="symbol">
            {{ asset.symbol }}
        </p>
        <p
            v-if="!asset.symbol && $vuetify.breakpoint.smAndUp"
            class="no_symbol"
        ></p>
        <router-link class="name_id" :to="`/asset/${asset.id}`">{{
            asset | nameOrID
        }}</router-link>
        <p class="volume_day">
            {{ asset.volume_day.toLocaleString() }}
            <span v-if="$vuetify.breakpoint.xs" class="unit">{{
                asset.symbol
            }}</span>
        </p>
        <p v-if="$vuetify.breakpoint.smAndUp" class="txCount_day">
            {{ asset.txCount_day.toLocaleString() }}
        </p>
        <p v-if="$vuetify.breakpoint.smAndUp" class="avgTx_day">
            {{ avgTxValue }}
        </p>
        <!-- <p class="denomination" v-if="$vuetify.breakpoint.smAndUp">{{asset.denomination}}</p> -->
        <p v-if="$vuetify.breakpoint.smAndUp" class="supply">
            {{ asset.currentSupply.toLocaleString(asset.denomination) }}
            <span>{{ asset.symbol }}</span>
        </p>
        <p v-if="$vuetify.breakpoint.smAndUp" class="chain">
            {{ asset.chainID | blockchain }}
        </p>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'

@Component({})
export default class AssetRow extends Vue {
    @Prop() asset!: Asset

    get avgTxValue(): string {
        return this.asset.txCount_day > 0
            ? this.asset.volume_day
                  .div(this.asset.txCount_day)
                  .toLocaleString(0)
            : ''
    }
}
</script>

<style scoped lang="scss">
.asset_row {
    > * {
        align-self: center;
    }

    > div {
        display: flex;
    }

    p {
        overflow: hidden;
        font-size: 14px;
        text-overflow: ellipsis;
    }

    a {
        color: $black !important;

        &:hover {
            opacity: 0.7;
            text-decoration: none;
        }
    }
}

.symbol {
    color: $secondary-color;
    background-color: $secondary-color-xlight;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
    font-weight: 400;
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
    font-weight: 400;
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

@include smOnly {
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

@include xsOrSmaller {
    .asset_row {
        p {
            font-size: 12px;
        }

        .unit {
            padding-left: 3px;
            min-width: 30px;
            display: inline-block;
            text-align: left;
            color: $gray;
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

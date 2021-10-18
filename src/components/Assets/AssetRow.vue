<template>
    <div>
        <p>
            <span v-if="asset.symbol" class="symbol">{{ asset.symbol }}</span>
            <span v-else class="no_symbol"></span>
        </p>
        <p>
            <router-link class="name_id" :to="`/asset/${asset.id}`">{{
                asset | nameOrID
            }}</router-link>
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
.avgTx_day {
    text-align: right;
}

@include smOnly {
    .symbol {
        padding: 2px;
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
        padding: 3px 6px;
    }
}
</style>

<template>
    <div class="card">
        <div class="header">
            <h2>
                Top Assets
                <TooltipHeading
                    content="The most transferred assets on Avalanche in the past 24 hours"
                ></TooltipHeading>
            </h2>
        </div>
        <div v-if="!assetAggregatesLoaded" class="table_spinner_container">
            <v-progress-circular
                key="1"
                :size="16"
                :width="2"
                color="#E84970"
                indeterminate
            ></v-progress-circular>
        </div>
        <div v-else>
            <div class="table">
                <div class="asset column_headers">
                    <p v-if="$vuetify.breakpoint.smAndUp"></p>
                    <p class="name">
                        Name <Tooltip content="Name for the asset"></Tooltip>
                    </p>
                    <p class="metric">
                        <Tooltip
                            content="Total number of transactions for the asset"
                        ></Tooltip
                        >Txs (24h)
                    </p>
                </div>
                <div v-for="asset in assets" :key="asset.id" class="asset">
                    <div v-if="$vuetify.breakpoint.smAndUp">
                        <span class="symbol">{{ asset.symbol }}</span>
                    </div>
                    <div class="name name_value">
                        <img
                            class="table_image"
                            :src="require(`@/assets/hex_ava_${hexColor}.svg`)"
                            alt
                        />
                        <router-link
                            :to="`/asset/${asset.id}`"
                            class="asset_name"
                            >{{ asset.name }}</router-link
                        >
                        <span class="collision">{{
                            collisionHash(asset)
                        }}</span>
                    </div>
                    <p class="metric metric_value">
                        {{ asset.txCount_day.toLocaleString() }}
                    </p>
                    <!--TODO: normalize asset.volume_day -->
                </div>
            </div>
            <div class="bottom">
                <router-link to="/assets" class="view_all"
                    >View All Assets</router-link
                >
            </div>
        </div>
        <!-- Balance Table - vuetify data table -->
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Tooltip from '../../../components/rows/Tooltip.vue'
import TooltipHeading from '../../../components/misc/TooltipHeading.vue'
import axios from '@/axios'
import { Asset } from '@/js/Asset'
import { AVAX_ID } from '@/store/index'
import { ICollisionMap } from '@/js/IAsset'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({
    components: {
        Tooltip,
        TooltipHeading,
    },
})
export default class TopAssets extends Vue {
    created() {
        const parent = this
    }

    get assets(): Asset[] {
        let res = this.$store.getters.assetsArrayNonProfane
        const avax = res.find((asset: Asset) => asset.id === AVAX_ID)
        res = res.filter((asset: Asset) => asset.id !== AVAX_ID)
        res.sort((a: Asset, b: Asset) => b.txCount_day - a.txCount_day)
        res.unshift(avax)
        return res.slice(0, 10)
    }

    get assetAggregatesLoaded(): boolean {
        return this.$store.state.assetAggregatesLoaded
    }

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    collisionHash(asset: Asset): string | null {
        return this.collisionMap[asset.symbol]
            ? `${asset.id.substring(0, 8)}`
            : null
    }

    get collisionMap(): ICollisionMap {
        return this.$store.state.collisionMap
    }

    get hexColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'mainnet' : 'testnet'
    }
}
</script>

<style scoped lang="scss">
.table_spinner_container {
    min-height: 265px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.table {
    border-bottom: 1px solid $gray-light;
}
.header {
    padding-bottom: 30px;
}

.column_headers {
    font-size: 12px;
    font-weight: 700;
    color: $primary-color;
    border-bottom: 1px solid $gray-light;
}

.asset {
    display: grid;
    grid-template-columns: 46px 1fr 100px;
    column-gap: 10px;
    padding: 4px 0 4px;
    font-size: 12px;
    overflow: auto;

    &:nth-child(6),
    &:nth-child(11) {
        border-bottom: 1px solid $gray-light;
    }

    > * {
        align-self: center;
    }

    p {
        white-space: nowrap;
        padding: 6px 0;
        border-radius: 2px;
    }

    .name {
        padding-left: 0;
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        margin-top: 1px;
    }

    .asset_name {
        font-size: 16px;
        color: $primary-color !important;
        font-weight: 400;
    }

    .collision {
        padding-left: 8px;
        font-size: 0.75em;
        color: $primary-color-light;
        font-weight: 400;

        :hover {
            text-decoration: none !important;
        }
    }

    .symbol {
        flex-shrink: 0;
        color: $secondary-color;
        background-color: $secondary-color-xlight;
        min-height: 1em;
        min-width: 38px;
        text-align: center;
        margin: 0;
        padding: 4px 4px;
        font-size: 12px;
        border-radius: 3px;
        display: inline-block;
        vertical-align: middle;
    }

    .metric {
        flex-shrink: 0;
        text-align: right;
        width: 100%;
        padding-right: 0;
        color: $primary-color;
    }

    .metric_value {
        font-size: 16px;
    }
}

.bottom {
    display: flex;
    flex-flow: row-reverse;
    justify-content: center;
    margin-top: 15px;
}

@include smOnly {
    .asset {
        column-gap: 3px;
    }
}

@include xsOnly {
    .asset {
        grid-template-columns: 1fr 100px;
    }
}
</style>

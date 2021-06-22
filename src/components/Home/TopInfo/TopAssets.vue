<template>
    <div class="card">
        <div class="header">
            <h2 class="top_info_heading">
                Top Assets
                <TooltipHeading
                    content="The most transferred assets on Avalanche P and X-Chains in the past 24 hours (excludes C-Chain)"
                />
            </h2>
        </div>
        <div v-if="!assetAggregatesLoaded" class="table_spinner_container">
            <v-progress-circular
                key="1"
                :size="16"
                :width="2"
                color="#E84970"
                indeterminate
            />
        </div>
        <div v-else>
            <div class="table">
                <div class="asset column_headers">
                    <p class="name">Asset</p>
                    <p class="metric">
                        <Tooltip
                            content="Total number of transactions involving the asset"
                        />Txs (24h)
                    </p>
                </div>
                <div v-for="asset in assets" :key="asset.id" class="asset">
                    <div class="name name_value">
                        <router-link
                            :to="`/asset/${asset.id}`"
                            class="asset_name logo_name_id"
                        >
                            <div class="logo_container">
                                <AssetLogoRenderer
                                    v-if="
                                        type(asset) === 'Fixed Cap' ||
                                        type(asset) === 'Variable Cap'
                                    "
                                    :asset="asset"
                                />
                                <NFTLogoRenderer v-else :asset="asset" />
                            </div>
                            <div class="name_id">
                                <span class="name">{{ asset.name }}</span>
                                <span class="collision monospace">{{
                                    collisionHash(asset)
                                }}</span>
                            </div>
                        </router-link>
                    </div>
                    <p class="metric metric_value">
                        {{ asset.txCount_day.toLocaleString() }}
                    </p>
                </div>
            </div>
            <div class="bottom">
                <v-btn :text="true" class="refresh ava_btn" @click="goToAssets">
                    <span class="ava-btn-label">View All Assets</span>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import TooltipHeading from '@/components/misc/TooltipHeading.vue'
import { Asset } from '@/js/Asset'
import { AVAX_ID } from '@/known_assets'
import { ICollisionMap } from '@/js/IAsset'
import AssetLogoRenderer from '@/components/Assets/AssetLogoRenderer.vue'
import NFTLogoRenderer from '@/components/Assets/NFTLogoRenderer.vue'

@Component({
    components: {
        Tooltip,
        TooltipHeading,
        AssetLogoRenderer,
        NFTLogoRenderer,
    },
})
export default class TopAssets extends Vue {
    get assets(): Asset[] {
        let res = this.$store.getters.assetsArrayNonProfane
        const avax = res.find((asset: Asset) => asset.id === AVAX_ID)
        res = res.filter((asset: Asset) => asset.id !== AVAX_ID)
        res.sort((a: Asset, b: Asset) => b.txCount_day - a.txCount_day)
        res.unshift(avax)
        return res.slice(0, 7)
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

    type(asset: Asset): string {
        return asset.nft === 1
            ? 'NFT'
            : asset.variableCap === 1
            ? 'Variable Cap'
            : 'Fixed Cap'
    }

    goToAssets() {
        this.$router.push('/assets')
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
    font-weight: 500;
    color: $primary-color;
    border-bottom: 1px solid $gray-light;

    &:hover {
        opacity: 1 !important;
    }
}

.asset {
    display: grid;
    grid-template-columns: 1fr 75px;
    column-gap: 10px;
    padding: 4px 0 4px;
    font-size: 12px;
    overflow: auto;

    &:hover {
        opacity: 0.7;
    }

    > * {
        align-self: center;
    }

    p {
        white-space: nowrap;
        padding: 6px 0;
        border-radius: 2px;
    }

    .logo_container {
        width: 26px;
        height: 26px;
    }

    .logo_name_id {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: 400;
        text-decoration: none;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .name_id {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: flex-end;

        .name {
            font-weight: 700;
        }
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
        font-size: 10px;
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

@include xsOrSmaller {
    .asset {
        grid-template-columns: 1fr 75px;
    }
}
</style>

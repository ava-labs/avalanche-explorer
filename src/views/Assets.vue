<template>
    <div class="assets">
        <div class="card">
            <div class="header">
                <h2>
                    Assets
                    <TooltipHeading content="A unit of value" />
                </h2>
                <template v-if="assetsLoaded">
                    <div class="bar">
                        <p class="count">
                            {{
                                Object.keys(assets).length | pluralize('asset')
                            }}
                            found
                        </p>
                    </div>
                    <div class="bar">
                        <p class="count">
                            Assets are updated on 5-min intervals. Please
                            refresh to view new listings.
                        </p>
                    </div>
                </template>
            </div>
            <div v-if="!assetsLoaded">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </div>
            <div
                v-if="assetsLoaded && $vuetify.breakpoint.smAndDown"
                class="asset_list"
            >
                <!-- SIMPLE TABLE FOR SMALL SCREENSIZES -->
                <div class="grid_headers asset_row">
                    <p v-if="$vuetify.breakpoint.smAndUp">
                        Symbol
                        <Tooltip
                            content="An arrangement of letters representing an asset"
                        />
                    </p>
                    <p>
                        Name
                        <Tooltip content="Name for the asset" />
                    </p>
                    <p class="volume_day">
                        <Tooltip content="Volume for the past 24h" />24h Volume
                    </p>
                    <p v-if="$vuetify.breakpoint.smAndUp" class="txCount_day">
                        <Tooltip
                            content="Number of transactions for the past 24h"
                        />
                        >24h Tx
                    </p>
                    <p v-if="$vuetify.breakpoint.smAndUp" class="avgTx_day">
                        <Tooltip content="Average tx value over the past 24h" />
                        >Avg Tx
                    </p>
                    <p v-if="$vuetify.breakpoint.smAndUp" class="supply">
                        <Tooltip content="Total number of tokens minted" />
                        >Supply
                    </p>
                    <p v-if="$vuetify.breakpoint.smAndUp" class="chain">
                        Issuance
                        <Tooltip
                            content="Blockchain where this asset was minted"
                        />
                    </p>
                </div>
                <asset-row
                    v-for="asset in assets"
                    :key="asset.id"
                    class="asset_row"
                    :asset="asset"
                ></asset-row>
            </div>
            <!-- DATA TABLE FOR MEDIUM SCREENSIZES -->
            <div v-if="$vuetify.breakpoint.smAndUp">
                <AssetsDataTable :assets="assets" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import AssetRow from '@/components/Assets/AssetRow.vue'
import AssetsDataTable from '@/components/Assets/AssetsDataTable.vue'
import Tooltip from '@/components/rows/Tooltip.vue'
import TooltipHeading from '@/components/misc/TooltipHeading.vue'
import { Asset } from '@/js/Asset'
import { AVAX_ID } from '@/known_assets'

@Component({
    components: {
        Tooltip,
        TooltipHeading,
        AssetRow,
        AssetsDataTable,
    },
})
export default class AssetsPage extends Vue {
    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    get assets(): Asset[] {
        let res: Asset[] = this.$store.getters.assetsArrayNonProfane
        const avax: Asset = res.find(
            (asset: Asset) => asset.id === AVAX_ID
        ) as Asset
        res = res.filter((asset: Asset) => asset.id !== AVAX_ID)
        res.sort((a: Asset, b: Asset) => b.txCount_day - a.txCount_day)
        res.unshift(avax)
        return res
    }

    get assetNames(): any[] {
        return this.assets.map((asset: Asset) => {
            return {
                name: asset.name,
                value: 1,
            }
        })
    }
}
</script>

<style scoped lang="scss">
.header {
    .count {
        padding-top: 5px;
        color: $primary-color-light;
        font-size: 12px;
    }
}

.grid_headers {
    font-weight: 500;
    font-size: 12px;
}

.asset_row {
    display: grid;
    grid-template-columns: 60px 1fr 150px 100px 100px 250px 100px;
    padding: 10px 0;
    border-bottom: 1px solid #e7e7e7;
    column-gap: 10px;

    &:last-of-type {
        border: none;
    }
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

@include smOnly {
    .asset_list {
        padding: 5px 0;
    }

    .asset_row {
        grid-template-columns: 50px 1fr 1fr;
        padding: 10px 0 5px;
    }
}

@include smOnly {
    .asset_list {
        padding: 5px 0;
    }

    .asset_row {
        grid-template-columns: 50px 1fr 1fr;
        padding: 10px 0 5px;
    }
}

@include xsOnly {
    .asset_list {
        padding: 5px 0;
    }

    .volume_day {
        padding-right: 37px;
    }

    .asset_row {
        grid-template-columns: 50% 50%;
        column-gap: 0;
    }
}
</style>

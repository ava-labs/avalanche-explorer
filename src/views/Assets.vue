<template>
    <div class="assets">
        <div class="card">
            <div class="header">
                <h2>Assets</h2>
                <v-alert class="testnet_alert" text type="info" rounded="0">
                    <p class="description">
                        Notice: This explorer only indexes the X-Chain and
                        P-Chain. To view C-Chain transactions (EVM chain), click
                        <a class="bold c_chain_link" :href="cChainURL">here</a>.
                    </p>
                </v-alert>
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
                v-if="assetsLoaded && $vuetify.breakpoint.xsOnly"
                class="asset_list"
            >
                <!-- SIMPLE TABLE FOR SMALL SCREENSIZES -->
                <div class="grid_headers asset_row">
                    <p>
                        Symbol
                        <Tooltip
                            content="An arrangement of letters representing an asset"
                        />
                    </p>
                    <p>
                        Name
                        <Tooltip content="Name for the asset" />
                    </p>
                </div>
                <AssetRow
                    v-for="asset in assets"
                    :key="asset.id"
                    class="asset_row"
                    :asset="asset"
                />
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
    font-weight: 500 !important;
    font-size: 12px;
}

.asset_row {
    display: grid;
    grid-template-columns: 60px 1fr;
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
}

@include xsOrSmaller {
    .asset_list {
        padding: 5px 0;
    }

    .volume_day {
        padding-right: 37px;
    }
}
</style>

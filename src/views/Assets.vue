<template>
    <div class="assets">
        <!-- <wordcloud
            v-if="assetsLoaded"
            :data="assetNames"
            nameKey="name"
            valueKey="value"
            :color="myColors"
            :showTooltip="true"
            :wordClick="wordClickHandler">
        </wordcloud> -->
        <div class="card">
            <div class="header">
                <h2>
                    Assets
                    <TooltipHeading
                        content="A unit of value"
                    ></TooltipHeading>
                </h2>
                <template v-if="assetsLoaded">
                    <div class="bar">
                        <p class="count">{{Object.keys(assets).length | pluralize}} found</p>
                    </div>
                </template>
            </div>
            <div v-if="!assetsLoaded">
                <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
            </div>
            <div class="asset_list" v-if="assetsLoaded && $vuetify.breakpoint.smAndDown">
                <div class="grid_headers asset_row">
                    <p v-if="$vuetify.breakpoint.smAndUp">
                        Symbol
                        <Tooltip content="An arrangement of letters representing an asset"></Tooltip>
                    </p>
                    <p>
                        Name
                        <Tooltip content="Name for the asset"></Tooltip>
                    </p>
                    <p class="volume_day">
                        <Tooltip content="Volume for the past 24h"></Tooltip>24h Volume
                    </p>
                    <p class="txCount_day" v-if="$vuetify.breakpoint.smAndUp">
                        <Tooltip content="Number of transactions for the past 24h"></Tooltip>24h Tx
                    </p>
                    <p class="avgTx_day" v-if="$vuetify.breakpoint.smAndUp">
                        <Tooltip content="Average tx value over the past 24h"></Tooltip>Avg Tx
                    </p>
                    <p class="supply" v-if="$vuetify.breakpoint.smAndUp">
                        <Tooltip content="Total number of tokens minted"></Tooltip>Supply
                    </p>
                    <p class="chain" v-if="$vuetify.breakpoint.smAndUp">
                        Issuance
                        <Tooltip content="Blockchain where this asset was minted"></Tooltip>
                    </p>
                </div>
                <asset-row v-for="asset in assets" :key="asset.id" class="asset_row" :asset="asset"></asset-row>
            </div>
            <div v-if="$vuetify.breakpoint.smAndUp">
                <AssetsDataTable :assets="assets"></AssetsDataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import AssetRow from "@/components/Assets/AssetRow.vue";
import AssetsDataTable from "@/components/Assets/AssetsDataTable.vue";
import Tooltip from "@/components/rows/Tooltip.vue";
import TooltipHeading from "@/components/misc/TooltipHeading.vue";
import { Asset } from "@/js/Asset";
import axios from "@/axios";
import { IAssetData_Ortelius } from "../js/IAsset";
//@ts-ignore
import wordcloud from 'vue-wordcloud';

@Component({
    components: {
        Tooltip,
        TooltipHeading,
        AssetRow,
        AssetsDataTable,
        wordcloud
    },
    filters: {
        pluralize(val:number) {
            return val === 0
                ? `${val} assets`
                : val > 1
                ? `${val.toLocaleString()} assets`
                : `${val} asset`;
        },
    }
})
export default class AssetsPage extends Vue {
    myColors: string[] = ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef'];
    
    //@ts-ignore
    wordClickHandler(name, value, vm) {
      console.log('wordClickHandler', name, value, vm);

    }

    get assets(): Asset[] {
        let res: Asset[] = this.$store.getters.assetsArrayNonProfane;
        let avax: Asset = res.find((asset: Asset) => asset.id === "nznftJBicce1PfWQeNEVBmDyweZZ6zcM3p78z9Hy9Hhdhfaxm") as Asset;
        res = res.filter((asset: Asset) => asset.id !== "nznftJBicce1PfWQeNEVBmDyweZZ6zcM3p78z9Hy9Hhdhfaxm");
        res.sort((a: Asset, b: Asset) => b.txCount_day - a.txCount_day);
        res.unshift(avax);
        return res;
    }

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded;
    }

    get assetNames(): any[] {
        return this.assets.map((asset:Asset) => {
            return {
                name: asset.name, 
                value: 1,
                // value: asset.currentSupply.toFixed(0)
            }
        });
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

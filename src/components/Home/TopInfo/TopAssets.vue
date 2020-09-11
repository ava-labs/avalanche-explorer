<template>
    <div>
        <div class="header">
            <h2>
                Top Assets
                <TooltipHeading
                    content="The most transferred assets on Avalanche in the past 24 hours"
                ></TooltipHeading>
            </h2>
        </div>
        <div v-if="!assetAggregatesLoaded">
            <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
        </div>
        <div v-else>
            <div class="asset column_headers">
                <p v-if="$vuetify.breakpoint.smAndUp"></p>
                <p class="name">
                    Name <Tooltip content="Name for the asset"></Tooltip>
                </p>
                <p class="metric">
                    <Tooltip content="Total number of transactions for the asset"></Tooltip>Txs (24h)
                </p>
            </div>
            <div class="asset" v-for="(asset) in assets" :key="asset.id">
                <div v-if="$vuetify.breakpoint.smAndUp"><span class="symbol">{{asset.symbol}}</span></div>
                <div class="name name_value">
                    <router-link :to="`/asset/${asset.id}`" class="asset_name">{{asset.name}}</router-link>
                    <span class="collision">{{collisionHash(asset)}}</span>
                </div>
                <p class="metric">{{asset.txCount_day.toLocaleString()}}</p>
                <!--TODO: normalize asset.volume_day -->
            </div>
            <div class="bottom" >
                <router-link to="/assets" class="view_all">View All Assets</router-link>
            </div>
        </div>
        <!-- Balance Table - vuetify data table -->
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import Tooltip from "../../../components/rows/Tooltip.vue";
import TooltipHeading from "../../../components/misc/TooltipHeading.vue";
import axios from "@/axios";
import { Asset } from "@/js/Asset";
import { AVAX_ID } from "@/store/index";
import { ICollisionMap } from '@/js/IAsset';

@Component({
    components: {
        Tooltip,
        TooltipHeading
    }
})
export default class TopAssets extends Vue {
    created() {
        let parent = this;
    }

    get assets(): Asset[] {
        let res = this.$store.getters.assetsArrayNonProfane;
        let avax = res.find((asset: Asset) => asset.id === AVAX_ID);
        res = res.filter((asset: Asset) => asset.id !== AVAX_ID);
        res.sort((a: Asset, b: Asset) => b.txCount_day - a.txCount_day);
        res.unshift(avax);
        return res.slice(0, 5);
    }

    get assetAggregatesLoaded(): boolean {
        return this.$store.state.assetAggregatesLoaded;
    }

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded;
    }

    collisionHash(asset: Asset): string | null {
        return (this.collisionMap[asset.symbol]) 
            ? `${asset.id.substring(0, 8)}`
            : null;
    }

    get collisionMap(): ICollisionMap {
        return this.$store.state.collisionMap;
    }
}
</script>

<style scoped lang="scss">
@use "../../../main";

.header {
    padding-bottom: 20px;
}

.column_headers {
    font-weight: 500;
    border-bottom: 1px solid main.$gray-light;
}

.asset {
    display: grid;
    grid-template-columns: 35px 1fr 100px;
    column-gap: 10px;
    margin-bottom: 8px;
    font-size: 12px;
    overflow: auto;

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
    }

    .asset_name {
        font-size: 12px;
        color: main.$primary-color !important;
        font-weight: bold;
    }

    .collision {
        padding-left: 8px;
        font-size: .75em;
        color: main.$primary-color-light;

        :hover {
            text-decoration: none !important;
        }
    }

    .symbol {
        flex-shrink: 0;
        color: main.$secondary-color;
        background-color: main.$secondary-color-xlight;
        min-height: 1em;
        min-width: 20px;
        text-align: center;
        margin: 0;
        padding: 3px 4px;
        font-size: 9px;
        border-radius: 3px;
        display: inline-block;
        vertical-align: middle;
    }

    .metric {
        flex-shrink: 0;
        text-align: right;
        width: 100%;
        padding-right: 0;
    }

    .metric-value {
        color: main.$green;
    }
}

.bottom {
    display: flex;
    flex-flow: row-reverse;
    justify-content: center;
    margin-top: 30px;
}

@include main.device_s {
    .asset {
        column-gap: 3px;
    }
}

@include main.device_xs {
    .asset {
        grid-template-columns: 1fr 100px;
    }
}
</style>

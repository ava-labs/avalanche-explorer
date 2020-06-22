<template>
    <div>
        <div class="header">
            <h2>
                Top Assets
                <TooltipHeading
                    content="the most transferred digital assets on the AVA platform in the past 24 hours"
                ></TooltipHeading>
            </h2>
        </div>
        <div class="asset column_headers">
            <p class="name">
                Name
                <Tooltip content="human-readable name for the asset (not necessarily unique)"></Tooltip>
            </p>
            <p class="metric">
                <Tooltip content="number of transactions of this asset"></Tooltip>Txs (24h)
            </p>
        </div>
        <div v-if="!assetsLoaded">
            <v-progress-circular :size="16" :width="2" color="#7a838e" indeterminate key="1"></v-progress-circular>
        </div>
        <div v-else>
            <div class="asset" v-for="(asset) in assets" :key="asset.id">
                <div class="name">
                    <router-link :to="`/asset/${asset.id}`" class="asset_name">{{asset.name}}</router-link>
                    <span class="symbol">{{asset.symbol}}</span>
                </div>
                <p class="metric ava-monospace">{{asset.txCount_day.toLocaleString()}}</p>
                <!--TODO: normalize asset.volume_day -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import Tooltip from "../../../components/rows/Tooltip.vue";
import TooltipHeading from "../../../components/misc/TooltipHeading.vue";
import axios from "@/axios";
import { Asset } from "@/js/Asset";

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
        let ava = res.find((asset: Asset) => asset.id === "21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA");
        res = res.filter((asset: Asset) => asset.id !== "21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA");
        res.sort((a: Asset, b: Asset) => b.txCount_day - a.txCount_day);
        res.unshift(ava);
        return res.slice(0, 5);
    }

    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded;
    }
}
</script>

<style scoped lang="scss">
@use "../../../main";

.header {
    padding-bottom: 20px;
}

.column_headers {
    font-weight: bold;

    p {
        border-bottom: 1px solid main.$gray-light;
    }
}

.asset {
    column-gap: 10px;
    margin-bottom: 8px;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    overflow: auto;

    > * {
        align-self: center;
    }

    p {
        white-space: nowrap;
        padding: 6px 12px;
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
        font-size: 14px;
        color: main.$black !important;
    }

    .symbol {
        flex-shrink: 0;
        color: main.$purple;
        background-color: main.$purple-light;
        min-height: 1em;
        min-width: 20px;
        text-align: center;
        margin: 0px 10px 5px;
        padding: 3px 4px;
        font-size: 9px;
        border-radius: 3px;
        display: inline-block;
        vertical-align: middle;
    }

    .metric {
        flex-shrink: 0;
        text-align: right;
        width: 70px;
        padding-right: 0;
    }

    .metric-value {
        color: main.$green;
    }
}

@include main.device_s {
    .asset {
        column-gap: 3px;
    }
}
</style>

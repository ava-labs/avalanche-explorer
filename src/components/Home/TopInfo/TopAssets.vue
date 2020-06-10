<template>
    <div>
        <div class="header">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <h2 v-on="on">24h Highest Volume Assets</h2>
                </template>
                <span>The most transferred smart digital assets on the AVA platform in the past 24 hours.</span>
            </v-tooltip>
        </div>
        <div class="asset column_headers">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <p class="name" v-on="on">Name</p>
                </template>
                <span>Human-readable name for the asset. Not necessarily unique.</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <p class="metric" v-on="on">Txs</p>
                </template>
                <span>Number of transactions of this asset.</span>
            </v-tooltip>
        </div>
        <div class="asset" v-for="(asset) in assets" :key="asset.id">
            <div class="name">
                <router-link :to="`/tx/${asset.id}`" class="asset_name">{{asset.name}}</router-link>
                <span class="symbol">{{asset.symbol}}</span>
            </div>
            <p class="metric ava-monospace">{{asset.txCount_day}}</p>
            <!--TODO: normalize asset.volume_day -->
        </div>
    </div>
</template>

<script>
import axios from "@/axios";

export default {
    created() {
        let parent = this;
    },
    computed: {
        assets() {
            let res = this.$store.getters.assetsArray;
            res.sort((a, b) => b.txCount_day - a.txCount_day);
            return res.slice(0, 5);
        }
    }
};
</script>

<style scoped lang="scss">
@use '../../../main';

.header {
    padding-bottom: 20px;
}

.column_headers {
    font-weight: bold;
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
        padding-left: 0px;
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .asset_name {
        font-size: 16px;
    }

    .symbol {
        flex-shrink: 0;
        color: #976cfa;
        background-color: #ebe4fb;
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
        width: 45px;
    }

    .metric-value {
        color: #56c18d;
    }
}

@include main.device_sm {
    .asset {
        column-gap: 3px;
    }
}
</style>

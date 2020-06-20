<template>
    <div class="assets">
        <div class="card">
            <div class="header">
                <h2>
                    Assets
                    <TooltipHeading content="A smart digital asset is a digital representation of a real-world thing such as an equity, bond, money etc. They can have a complex ruleset that defines their behavior and how they are handled."></TooltipHeading>
                </h2>
                <div class="bar">
                    <p class="count">{{Object.keys(assets).length}} assets found</p>
                </div>
            </div>
            <div class="asset_list">
                <div class="grid_headers asset_row">
                    <p>
                        Symbol <Tooltip content="shorthand ticker symbol of the asset"></Tooltip>
                    </p>
                    <p>
                        Name <Tooltip content="human-readable name for the asset"></Tooltip>
                    </p>
                    <p class="volume_day">
                        <Tooltip content="volume for the past 24h"></Tooltip>24h Volume
                    </p>
                    <p class="txCount_day">
                        <Tooltip content="number of transactions for the past 24h"></Tooltip>24h Tx
                    </p>
                    <p class="avgTx_day">
                        <Tooltip content="average tx value over the past 24h"></Tooltip>Avg Tx
                    </p>
                    <!-- <p class="denomination">
                        <Tooltip content="determines how balances of this asset are displayed by user interfaces"></Tooltip>
                        Denom.
                    </p>-->
                    <p class="supply">
                        <Tooltip content="units of the asset that have been created"></Tooltip>Supply
                    </p>
                    <p class="chain">
                        Issuance <Tooltip content="blockchain where this asset was minted"></Tooltip>
                    </p>
                </div>
                <asset v-for="asset in assets" :key="asset.id" class="asset_row" :asset="asset"></asset>
            </div>
        </div>
    </div>
</template>
<script>
import Asset from "@/components/Assets/Asset";
import Tooltip from "../components/rows/Tooltip";
import TooltipHeading from "../components/misc/TooltipHeading";
import axios from "@/axios";

export default {
    components: {
        Tooltip,
        TooltipHeading,
        Asset
    },
    data() {
        return {};
    },
    computed: {
        assets() {
            return this.$store.getters.assetsArrayNonProfane;
        }
    }
};
</script>
<style scoped lang="scss">
@use "../main";

.header {
    margin-bottom: 30px;

    .count {
        padding-top: 5px;
        color: #808080;
        font-size: 12px;
    }
}

.grid_headers {
    font-weight: 500;
    font-size: 12px;
}

.asset_row {
    display: grid;
    grid-template-columns: 60px 200px 150px 110px 150px 1fr 100px;
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

@include main.device_s {
    .grid_headers {
        display: none;
    }

    .asset_list {
        padding: 5px 0;
    }

    .asset_row {
        grid-template-columns: 50px 1fr 1fr;
        padding: 10px 0 5px;
    }
}
</style>

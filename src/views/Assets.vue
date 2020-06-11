<template>
    <div class="assets">
        <div class="card">
            <div class="header">
                <h2>
                    Assets
                    <v-tooltip bottom left>
                        <template v-slot:activator="{ on }">
                            <fa
                                v-on="on"
                                icon="info-circle"
                                transform="shrink-3"
                                :style="{ color: '#e8e7ea' }"
                            ></fa>
                        </template>
                        <span>
                            A smart digital asset is a digital representation of a real-world thing such as an equity, bond, money etc.
                            <br />They can have a complex ruleset that defines their behavior and how they are handled.
                            <br />This ruleset can include things like, “can’t be traded until next year,” for example.
                        </span>
                    </v-tooltip>
                </h2>
                <div class="bar">
                    <p class="count">{{Object.keys(assets).length}} assets found</p>
                </div>
            </div>
            <div class="asset_list">
                <div class="grid_headers asset_row">
                    <p>
                        Symbol
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <fa
                                    v-on="on"
                                    icon="info-circle"
                                    transform="shrink-4"
                                    :style="{ color: '#e8e7ea' }"
                                ></fa>
                            </template>
                            <span>
                                Shorthand ticker symbol of the asset.
                                <br />Not necessarily unique.
                            </span>
                        </v-tooltip>
                    </p>
                    <p>
                        Name
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <fa
                                    v-on="on"
                                    icon="info-circle"
                                    transform="shrink-4"
                                    :style="{ color: '#e8e7ea' }"
                                ></fa>
                            </template>
                            <span>
                                Human-readable name for the asset.
                                <br />Not necessarily unique.
                            </span>
                        </v-tooltip>
                    </p>
                    <p>
                        Genesis Tx ID
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <fa
                                    v-on="on"
                                    icon="info-circle"
                                    transform="shrink-4"
                                    :style="{ color: '#e8e7ea' }"
                                ></fa>
                            </template>
                            <span>A transaction queries or modifies the state of a blockchain.</span>
                        </v-tooltip>
                    </p>
                    <p>
                        Chain
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <fa
                                    v-on="on"
                                    icon="info-circle"
                                    transform="shrink-4"
                                    :style="{ color: '#e8e7ea' }"
                                ></fa>
                            </template>
                            <span>Blockchain where this asset was minted.</span>
                        </v-tooltip>
                    </p>
                    <p class="denomination">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <fa
                                    v-on="on"
                                    icon="info-circle"
                                    transform="shrink-4"
                                    :style="{ color: '#e8e7ea' }"
                                ></fa>
                            </template>
                            <span>Determines how balances of this asset are displayed by user interfaces</span>
                        </v-tooltip>Denomination
                    </p>
                    <p class="supply">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <fa
                                    v-on="on"
                                    icon="info-circle"
                                    transform="shrink-4"
                                    :style="{ color: '#e8e7ea' }"
                                ></fa>
                            </template>
                            <span>Units of the asset that have been created</span>
                        </v-tooltip>Supply
                    </p>
                </div>
                <asset v-for="asset in assets" :key="asset.id" class="asset_row" :asset="asset"></asset>
            </div>
        </div>
    </div>
</template>
<script>
import Asset from "@/components/Assets/Asset";
import axios from "@/axios";

export default {
    components: {
        Asset
    },
    data() {
        return {};
    },
    computed: {
        assets() {
            return this.$store.state.assets;
        }
    }
};
</script>
<style scoped lang="scss">
@use '../main';

.header {
    padding-bottom: 20px;
    margin-bottom: 10px;

    .count {
        padding-top: 5px;
        color: #808080;
        font-size: 12px;
    }
}

.grid_headers {
    font-weight: bold;
    font-size: 12px;
}

.asset_row {
    display: grid;
    grid-template-columns: 60px 200px 110px 90px 110px 1fr;
    padding: 5px 15px;
    border-bottom: 1px solid #e7e7e7;
    column-gap: 10px;

    &:last-of-type {
        border: none;
    }
}

.denomination {
    text-align: right;
}

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

<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>
                    {{asset | name}}
                    <span class="symbol">{{asset.symbol}}</span>
                    <p v-if="asset.alias">Alias: {{asset.alias}}</p>
                </h2>
            </div>
            <section class="meta_data">
                <article>
                    <img src="@/assets/ava_price.png" />
                    <div class="stat_container">
                        <p class="label">
                            24h Volume
                            <v-tooltip bottom v-if="$vuetify.breakpoint.smAndUp">
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total value of {{asset.symbol}} tokens transferred on the AVA network in the past 24 hours</span>
                            </v-tooltip>
                        </p>
                        <p class="meta_val">{{asset.volume_day}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/ava_transactions.png" />
                    <div class="stat_container">
                        <p class="label">
                            24h Transactions
                            <v-tooltip bottom v-if="$vuetify.breakpoint.smAndUp">
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total number of transactions involving {{asset.symbol}} tokens in the past 24 hours</span>
                            </v-tooltip>
                        </p>
                        <p class="meta_val">{{asset.txCount_day}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/blockchain.png" />
                    <div class="stat_container">
                        <p class="label">
                            Minted On
                            <v-tooltip bottom v-if="$vuetify.breakpoint.smAndUp">
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>the blockchain on which {{asset.symbol}} was created</span>
                            </v-tooltip>
                        </p>
                        <p class="meta_val">{{asset.chainID | blockchain }}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/stake_amount.png" />
                    <div class="stat_container">
                        <p class="label">
                            Initial Supply
                            <v-tooltip bottom v-if="$vuetify.breakpoint.smAndUp">
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total initial value of {{asset.symbol}} tokens minted</span>
                            </v-tooltip>
                        </p>
                        <p class="meta_val">{{asset.currentSupply}} {{asset.symbol}}</p>
                        <p class="meta_annotation">Denomination: {{asset.denomination}}</p>
                    </div>
                </article>
            </section>
        </div>
    </div>
</template>
<script>
import Big from "big.js";
import IAsset from "../../js/IAsset";
import { blockchainMap } from "../../helper";

export default {
    props: {
        asset: IAsset
    },
    filters: {
        name(val) {
            return val.name ? val.name : val.id;
        },
        blockchain(val) {
            return blockchainMap(val);
        }
    }
};
</script>
<style scoped lang="scss">
@use '../../main';

.metadata {
    margin-bottom: 30px;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 25% 25% 25% 25%;

    > article {
        padding: 30px 15px;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }

    img {
        object-fit: contain;
        width: 24px;
        margin: 24px 15px 0 0;
    }

    .stat_container {
        display: flex;
        flex-direction: column;

        .label {
            text-transform: capitalize;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 6px;
            opacity: 0.7;
        }

        .meta_val {
            font-size: 32px;
            font-weight: bold;
            line-height: 1em;
        }

        .meta_annotation {
            font-size: 12px;
            margin-top: .5em;
        }
    }
}

@include main.device_s {
    .meta_data {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;

        > div {
            padding: 30px 0 0;
        }
    }
}
</style>

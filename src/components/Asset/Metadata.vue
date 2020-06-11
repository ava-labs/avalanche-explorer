<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>
                    {{asset | name}}
                    <span class="symbol">{{asset.symbol}}</span>
                    <v-tooltip bottom left>
                        <template v-slot:activator="{ on }">
                            <fa
                                v-on="on"
                                icon="info-circle"
                                transform="shrink-3"
                                :style="{ color: '#e8e7ea' }"
                            ></fa>
                        </template>
                        <span></span>
                    </v-tooltip>
                </h2>
            </div>
            <div class="meta_data">
                <div>
                    <img src="@/assets/subnet.png" />
                    <div>
                        <p class="label">
                            24h Transactions
                            <v-tooltip bottom>
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
                </div>
                <div>
                    <img src="@/assets/blockchain.png" />
                    <div>
                        <p class="label">
                            24h Volume
                            <v-tooltip bottom>
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
                </div>
                <div>
                    <img src="@/assets/validators.png" />
                    <div>
                        <p class="label">
                            Initial Supply
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>the initial amount of {{asset.symbol}} tokens minted</span>
                            </v-tooltip>
                        </p>

                        <p class="meta_val">{{asset.currentSupply}} {{asset.symbol}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/ava_price.png" />
                    <div>
                        <p class="label">
                            Total Stake Amount
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <fa
                                        v-on="on"
                                        icon="info-circle"
                                        transform="shrink-3"
                                        :style="{ color: '#e8e7ea' }"
                                    ></fa>
                                </template>
                                <span>total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method</span>
                            </v-tooltip>
                        </p>
                        <p class="meta_val">ppppp AVA</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Big from "big.js";
import IAsset from "../../js/IAsset"

export default {
    props: {
        asset: IAsset,
    },
    filters: {
        name(val) {
            return val.name ? val.name : val.id;
        },
    },
};
</script>
<style scoped lang="scss">
@use '../../main';

.metadata {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 20% 20% 20% 40%;

    img {
        object-fit: contain;
        width: 40px;
        margin-right: 15px;
    }

    > div {
        padding: 30px;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    p {
        font-size: 32px;
        font-weight: bold;
    }

    .label {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 6px;
        opacity: 0.7;
    }

    .meta_val {
        line-height: 1em;
    }
}

@include main.device_sm {
    .meta_data {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;

        > div {
            padding: 30px 0 0;
        }
    }
}
</style>

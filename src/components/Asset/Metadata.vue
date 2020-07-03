<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>
                    {{asset | name}}
                    <span class="symbol">{{asset.symbol}}</span>
                    <p class="alias" v-if="asset.alias">Alias: {{asset.alias}}</p>
                </h2>
            </div>
            <section class="stats">
                <article>
                    <img src="@/assets/ava_price-purple.png" />
                    <div class="stat">
                        <p class="label">
                            24h Volume
                            <TooltipMeta v-bind:content="'number of ' + asset.symbol + ' tokens transferred on the Avalanche network in the past 24 hours'"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{parseInt(asset.volume_day.toFixed(0)).toLocaleString()}} <span class="unit">{{asset.symbol}}</span></p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/ava_transactions-purple.png" />
                    <div class="stat">
                        <p class="label">
                            24h Transactions
                            <TooltipMeta v-bind:content="'number of transactions involving ' + asset.symbol + ' tokens in the past 24 hours'"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{asset.txCount_day.toLocaleString()}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/blockchain-purple.png" />
                    <div class="stat">
                        <p class="label">
                            Minted On
                            <TooltipMeta v-bind:content="'blockchain on which ' + asset.symbol + ' was created'"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{asset.chainID | blockchain }}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/stake_amount-purple.png" />
                    <div class="stat">
                        <p class="label">
                            Initial Supply
                            <TooltipMeta v-bind:content="'initial value of ' + asset.symbol + ' tokens minted'"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{asset.currentSupply.toLocaleString(asset.denomination)}} <span class="unit">{{asset.symbol}}</span></p>
                        <p class="meta_annotation">Denomination: {{asset.denomination}}</p>
                    </div>
                </article>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import Big from "big.js";
import { Asset } from "@/js/Asset";
import { blockchainMap } from "../../helper";
import TooltipMeta from "../../components/misc/TooltipMeta.vue";

@Component ({
    components: {
        TooltipMeta
    },

    filters: {
        name(val: Asset): string {
            return val.name ? val.name : val.id;
        },
        blockchain(val: string): string {
            return blockchainMap(val);
        }
    }
})

export default class Metadata extends Vue {
    @Prop() asset!: Asset;
}

</script>

<style scoped lang="scss">
@use"../../main";

.metadata {
    margin-bottom: 30px;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .alias {
            margin-top: .5em;
            font-size: 14px;
        }
    }

    .symbol {
        flex-shrink: 0;
        color: main.$primary-color;
        background-color: main.$primary-color-light;
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

.stats {
    display: grid;
    width: 100%;
    grid-template-columns: 25% 25% 25% 25%;

    > article {
        padding: 30px 15px 0;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    img {
        object-fit: contain;
        width: 24px;
        margin: 0 14px 0 0;
    }

    .stat {
        display: flex;
        flex-direction: column;

        p {
            font-weight: 400; /* 700 */
        }

        .label {
            text-transform: capitalize;
            color: main.$primary-color;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
        }

        .meta_val {
            font-size: 26px;
            line-height: 1em;

            .unit {
                font-size: 14px;
                opacity: 0.7;
            }
        }

        .meta_annotation {
            font-size: 14px;
            opacity: 0.7;
        }
    }
}

@include main.device_m {
    .stats {
        img {
            width: 24px;
        }

        .stat {
            .label {
                font-size: 13px;
            }

            .meta_val {
                font-size: 20px;

                .unit {
                    font-size: 14px;
                }
            }
        }
    }
}

@include main.device_s {
    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

        > article {
            padding: 30px 0 0;
        }
    }
}


@include main.device_xs {
    .metadata {
        margin-bottom: 10px;

        .header {
            display: flex;
            justify-content: space-between;
        }
    }

    .stats {
        grid-template-columns: none;

        > article {
            padding: 30px 0 0;
        }

        img {
            display: none;
        }
    }
}

</style>

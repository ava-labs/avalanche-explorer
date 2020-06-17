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
                            <TooltipMeta v-bind:content="'number of ' + asset.symbol + ' tokens transferred on the AVA network in the past 24 hours'"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{asset.volume_day.toLocaleString()}} {{asset.symbol}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/ava_transactions.png" />
                    <div class="stat_container">
                        <p class="label">
                            24h Transactions
                            <TooltipMeta v-bind:content="'number of transactions involving ' + asset.symbol + ' tokens in the past 24 hours'"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{asset.txCount_day.toLocaleString()}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/blockchain.png" />
                    <div class="stat_container">
                        <p class="label">
                            Minted On
                            <TooltipMeta v-bind:content="'blockchain on which ' + asset.symbol + ' was created'"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{asset.chainID | blockchain }}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/stake_amount.png" />
                    <div class="stat_container">
                        <p class="label">
                            Initial Supply
                            <TooltipMeta v-bind:content="'initial value of ' + asset.symbol + ' tokens minted'"></TooltipMeta>
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
import TooltipMeta from "../../components/misc/TooltipMeta";

export default {
    components: {
        TooltipMeta
    },
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
@use"../../main";

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


@include main.device_xs {
    .meta_data {
        > div {
            padding: 30px 0 0;
        }
    }

    .meta_data > article {
        padding: 15px 0;
    }
}

</style>

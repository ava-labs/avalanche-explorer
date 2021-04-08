<template>
    <section class="stats">
        <article v-if="asset.alias">
            <div class="meta_row">
                <p class="label">
                    Alias
                    <TooltipMeta
                        :content="'Alias of ' + asset.id"
                    ></TooltipMeta>
                </p>
                <p class="meta_val">
                    {{ asset.alias }}
                </p>
            </div>
        </article>
        <article v-if="asset.alias">
            <div class="meta_row">
                <p class="label">
                    ID
                    <TooltipMeta
                        :content="'Unique identifier of token'"
                    ></TooltipMeta>
                </p>
                <p class="meta_val">
                    {{ asset.id }}
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    24h Volume
                    <TooltipMeta
                        :content="
                            'Total value of ' +
                            asset.symbol +
                            ' transferred on Avalanche in the past 24 hours'
                        "
                    ></TooltipMeta>
                </p>
                <p class="meta_val">
                    {{ parseInt(asset.volume_day.toFixed(0)).toLocaleString() }}
                    <span class="unit">{{ asset.symbol }}</span>
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    24h Transactions
                    <TooltipMeta
                        :content="
                            'Total number of state queries or modifications of blockchains involving ' +
                            asset.symbol +
                            ' in the past 24 hours'
                        "
                    ></TooltipMeta>
                </p>
                <p class="meta_val">
                    {{ asset.txCount_day.toLocaleString() }}
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    Minted On
                    <TooltipMeta
                        :content="
                            'Blockchain where ' + asset.symbol + ' was minted'
                        "
                    ></TooltipMeta>
                </p>
                <p class="meta_val">
                    {{ asset.chainID | blockchain }}
                </p>
            </div>
        </article>
        <article>
            <div class="meta_row">
                <p class="label">
                    Initial Supply
                    <TooltipMeta
                        :content="
                            'Initial value of ' + asset.symbol + ' minted'
                        "
                    ></TooltipMeta>
                </p>
                <p class="meta_val">
                    {{ asset.currentSupply.toLocaleString(asset.denomination) }}
                    <span class="unit">{{ asset.symbol }}</span>
                </p>
                <p class="meta_annotation">Minimal Transferrable Unit:</p>
                <p class="meta_annotation">
                    {{ minimalTransferrableUnit }} ({{
                        asset.denomination | pluralizeDenomination
                    }})
                </p>
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import { blockchainMap } from '@/helper'
import TooltipMeta from '@/components/misc/TooltipMeta.vue'
import TransactionHistory from '@/components/Home/TopInfo/TransactionHistory.vue'

@Component({
    components: {
        TooltipMeta,
        TransactionHistory,
    },

    filters: {
        blockchain(val: string): string {
            return blockchainMap(val)
        },
        pluralizeDenomination(val: number): string {
            return val === 0
                ? `no fractional units`
                : val > 1
                ? `${val} decimal digits`
                : `${val} decimal digit`
        },
    },
})
export default class Metadata extends Vue {
    @Prop() asset!: Asset

    get minimalTransferrableUnit() {
        const power = -1 * this.asset.denomination
        return Math.pow(10, power).toFixed(this.asset.denomination)
    }
}
</script>

<style scoped lang="scss">
.stats {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr;

    > article {
        padding: 30px 0;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .stat {
        display: flex;
        flex-direction: column;

        p {
            font-weight: 400; /* 700 */
        }

        .label {
            text-transform: capitalize;
            color: $primary-color;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
        }

        .meta_val {
            font-size: 22px;
            line-height: 1em;

            .unit {
                font-size: 14px;
                opacity: 0.7;
            }
        }

        .meta_annotation {
            font-size: 12px;
            opacity: 0.7;
        }
    }
}

@include mdOnly {
    .stats {
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

@include smOnly {
    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

        > article {
            padding: 30px 0 0;
        }
    }
}

@include xsOnly {
    .stats {
        grid-template-columns: none;

        > article {
            padding: 30px 0 0;
        }
    }
}
</style>

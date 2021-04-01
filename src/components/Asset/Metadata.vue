<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>
                    {{ asset | name }}
                    <span class="symbol">{{ asset.symbol }}</span>
                    <p v-if="asset.alias" class="alias">
                        <span>Alias</span> {{ asset.alias }}
                    </p>
                    <p class="alias"><span>ID</span> {{ asset.id }}</p>
                </h2>
            </div>
            <section class="stats">
                <article>
                    <div class="stat">
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
                            {{
                                parseInt(
                                    asset.volume_day.toFixed(0)
                                ).toLocaleString()
                            }}
                            <span class="unit">{{ asset.symbol }}</span>
                        </p>
                    </div>
                </article>
                <article>
                    <div class="stat">
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
                    <div class="stat">
                        <p class="label">
                            Minted On
                            <TooltipMeta
                                :content="
                                    'Blockchain where ' +
                                    asset.symbol +
                                    ' was minted'
                                "
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">{{ asset.chainID | blockchain }}</p>
                    </div>
                </article>
                <article>
                    <div class="stat">
                        <p class="label">
                            Initial Supply
                            <TooltipMeta
                                :content="
                                    'Initial value of ' +
                                    asset.symbol +
                                    ' minted'
                                "
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">
                            {{
                                asset.currentSupply.toLocaleString(
                                    asset.denomination
                                )
                            }}
                            <span class="unit">{{ asset.symbol }}</span>
                        </p>
                        <p class="meta_annotation">
                            Minimal Transferrable Unit:
                        </p>
                        <p class="meta_annotation">
                            {{ minimalTransferrableUnit }} ({{
                                asset.denomination | pluralizeDenomination
                            }})
                        </p>
                    </div>
                </article>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import { blockchainMap } from '../../helper'
import TooltipMeta from '../../components/misc/TooltipMeta.vue'

@Component({
    components: {
        TooltipMeta,
    },

    filters: {
        name(val: Asset): string {
            return val.name ? val.name : val.id
        },
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
.metadata {
    margin-bottom: 15px;

    .header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .alias {
            margin-top: 0.5em;
            font-size: 14px;
        }
    }

    .symbol {
        flex-shrink: 0;
        color: $secondary-color;
        background-color: $secondary-color-xlight;
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

.alias {
    span {
        font-weight: 700;
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
    }
}
</style>

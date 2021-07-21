<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>Subnets</h2>
            </div>
            <section class="stats">
                <article>
                    <div class="stat">
                        <p class="label">
                            Subnets
                            <TooltipMeta
                                content="Total number of subnets on Avalanche"
                            />
                        </p>
                        <p class="meta_val">
                            {{ totalSubnets.toLocaleString() }}
                        </p>
                    </div>
                </article>
                <article>
                    <div class="stat">
                        <p class="label">
                            Blockchains
                            <TooltipMeta
                                content="Total number of blockchains on Avalanche"
                            />
                        </p>
                        <p class="meta_val">
                            {{ totalBlockchains.toLocaleString() }}
                        </p>
                    </div>
                </article>
                <article>
                    <div class="stat">
                        <p class="label">
                            Validators
                            <TooltipMeta
                                content="Total number of nodes validating transactions on Avalanche"
                            />
                        </p>
                        <p class="meta_val">
                            {{ totalValidators.toLocaleString() }}
                        </p>
                    </div>
                </article>
                <article>
                    <div class="stat">
                        <p class="label">
                            Total Stake Amount
                            <TooltipMeta
                                content="Total value of AVAX locked to secure Avalanche"
                            />
                        </p>
                        <p class="meta_val">
                            {{ totalStake.toLocaleString() }}
                            <span class="unit">AVAX</span>
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
import TooltipHeading from '../../components/misc/TooltipHeading.vue'
import TooltipMeta from '../../components/misc/TooltipMeta.vue'
import Big from 'big.js'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({
    components: {
        TooltipHeading,
        TooltipMeta,
    },
})
export default class Metadata extends Vue {
    @Prop() totalSubnets!: number
    @Prop() totalBlockchains!: number
    @Prop() totalValidators!: number
    @Prop() totalStake!: Big

    get imgColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'testnet' : 'testnet'
    }
}
</script>

<style scoped lang="scss">
.metadata {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.stats {
    display: grid;
    width: 100%;
    grid-template-columns: 20% 20% 20% 40%;

    > article {
        padding: 30px 15px 0;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
    }

    .stat {
        display: flex;
        flex-direction: column;

        p {
            font-weight: 400;
        }

        .label {
            text-transform: capitalize;
            color: $primary-color;
            font-size: 12px;
            margin-bottom: 6px;
        }

        .meta_val {
            font-size: 36px;
            line-height: 1em;

            .unit {
                font-size: 20px;
                opacity: 0.7;
            }
        }
    }
}

@include mdOnly {
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

@include smOnly {
    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

        > div {
            padding: 30px 0 0;
        }
    }
}

@include xsOrSmaller {
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

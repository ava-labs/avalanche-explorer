<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>
                    Subnets
                    <TooltipHeading
                        content="A Subnet is a set of validators. A Subnet validates a set of blockchains. Each blockchain is validated by exactly one Subnet, which is specified on blockchain creation."
                    ></TooltipHeading>
                </h2>
            </div>
            <section class="stats">
                <article>
                    <img src="@/assets/subnet-purple.png" />
                    <div class="stat">
                        <p class="label">
                            Subnetworks
                            <TooltipMeta
                                content="total number of subnets created on the AVA network"
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalSubnets.toLocaleString()}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/blockchain-purple.png" />
                    <div class="stat">
                        <p class="label">
                            Blockchains
                            <TooltipMeta
                                content="total number of blockchains created on the AVA network"
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalBlockchains.toLocaleString()}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/validators-purple.png" />
                    <div class="stat">
                        <p class="label">
                            Validators
                            <TooltipMeta
                                content="total number of nodes participating in the consensus protocol of the AVA network"
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalValidators.toLocaleString()}}</p>
                    </div>
                </article>
                <article>
                    <img src="@/assets/ava_price-purple.png" />
                    <div class="stat">
                        <p class="label">
                            Total Stake Amount
                            <TooltipMeta
                                content="total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method"
                            ></TooltipMeta>
                        </p>
                        <p class="meta_val">
                            {{totalStake.toLocaleString()}}
                            <span class="unit">AVA</span>
                        </p>
                    </div>
                </article>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import TooltipHeading from "../../components/misc/TooltipHeading.vue";
import TooltipMeta from "../../components/misc/TooltipMeta.vue";
import Big from "big.js";

@Component({
    components: {
        TooltipHeading,
        TooltipMeta
    }
})
export default class Metadata extends Vue {
    @Prop() totalSubnets!: number;
    @Prop() totalBlockchains!: number;
    @Prop() totalValidators!: number;
    @Prop() totalStake!: Big;
}
</script>

<style scoped lang="scss">
@use "../../main";

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

    img {
        object-fit: contain;
        width: 40px;
        margin-right: 20px;
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
            margin-bottom: 6px;
        }

        .meta_val {
            font-size: 32px;
            line-height: 1em;

            .unit {
                font-size: 14px;
                opacity: 0.7;
            }
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

        > div {
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

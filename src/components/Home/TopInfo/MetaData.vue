<template>
    <div>
        <div class="header">
            <h2 class="meta_title">
                Network Activity
                <TooltipHeading content="key figures of the AVA network"></TooltipHeading>
            </h2>
        </div>
        <section class="stats">
            <article class="meta">
                <img src="@/assets/ava_transactions-purple.png" />
                <div class="stat">
                    <p class="label">
                        24h Transactions
                        <TooltipMeta
                            content="total number of queries or modifications of the states of all blockchains on the AVA network in the past 24 hours"
                        ></TooltipMeta>
                    </p>
                    <div>
                        <p class="meta_val">
                            {{avaTxCount.toLocaleString()}}
                            <span class="unit">({{tpsText}} TPS)</span>
                        </p>
                    </div>
                </div>
            </article>
            <article class="meta">
                <img src="@/assets/ava_price-purple.png" />
                <div class="stat">
                    <p class="label">
                        24h Volume
                        <TooltipMeta
                            content="total value of $AVA tokens transferred on the AVA network in the past 24 hours"
                        ></TooltipMeta>
                    </p>
                    <div>
                        <p class="meta_val">
                            {{avaVolume}}
                            <span class="unit">AVA</span>
                        </p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                </div>
            </article>
            <article class="meta">
                <img src="@/assets/validators-purple.png" />
                <div class="stat">
                    <p class="label">
                        Validators
                        <TooltipMeta
                            content="total value of $AVA tokens transferred on the AVA network in the past 24 hours"
                        ></TooltipMeta>
                    </p>
                    <div>
                        <p class="meta_val">{{validatorCount.toLocaleString()}}</p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                </div>
            </article>
            <article class="meta">
                <img src="@/assets/stake_amount-purple.png" />
                <div class="stat">
                    <p class="label">
                        Total Staked
                        <TooltipMeta
                            content="total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method"
                        ></TooltipMeta>
                    </p>
                    <div>
                        <p class="meta_val">
                            {{totalStake}}
                            <span class="unit">AVA</span>
                        </p>
                    </div>
                </div>
            </article>
        </section>
    </div>
</template>
<script>
import axios from "@/axios";
import { stringToBig } from "@/helper";
import TooltipHeading from "../../misc/TooltipHeading";
import TooltipMeta from "../TopInfo/TooltipMeta";

export default {
    components: {
        TooltipHeading,
        TooltipMeta
    },
    data() {
        return {
            avaMarketCap: 0,
            avaTxCount: 0,
            avaPrice: 34.0
        };
    },
    created() {
        let parent = this;

        let dayMs = 1000 * 60 * 60 * 24;
        let endMs = Date.now();
        let startMs = endMs - dayMs;

        let startTime = new Date(startMs).toISOString();
        let endTime = new Date(endMs).toISOString();

        // get 24h transaction counts
        axios
            .get(`/x/transactions/aggregates?startTime=${startTime}&endTime=${endTime}`)
            .then(res => {
                parent.avaTxCount = res.data.aggregates.transactionCount;
            });
    },
    computed: {
        tpsText() {
            let day = 60 * 60 * 24;
            let avg = this.avaTxCount / day;
            return (avg > 1) ? avg.toFixed(0) : avg.toFixed(2);
        },
        totalStake() {
            let res = this.$store.getters["Platform/totalStake"];
            res = stringToBig(res.toString(), 9).toFixed(0);
            return parseInt(res).toLocaleString();
        },
        validatorCount() {
            return this.$store.getters["Platform/totalValidators"];
        },
        avaVolume() {
            let assets = this.$store.state.assets;
            let ava = assets["21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA"];
            return (!ava) ? 0 : parseInt(ava.volume_day.toFixed(0)).toLocaleString();
        }
    }
};
</script>
<style scoped lang="scss">
@use "../../../main";

.header {
    padding-bottom: 20px;
}

.stats {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    row-gap: 30px;
    column-gap: 30px;
    padding: 4px 0 0;
    flex-wrap: wrap;
    overflow: auto;

    .meta {
        font-size: 12px;
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;

        img {
            object-fit: contain;
            width: 16px;
            height: 16px;
            max-height: 23px;
            margin-right: 4px;
        }

        .stat > div {
            display: flex;
        }

        p {
            padding: 2px 4px;
            font-weight: 400; /* 700 */
        }

        .label {
            text-transform: capitalize;
            color: main.$primary-color;
            font-size: 10px;
            margin-bottom: 4px;
        }

        .meta_val {
            font-size: 16px;
            line-height: 1em;

            .unit {
                font-size: 14px;
                opacity: 0.7;
            }
        }

        .change {
            background-color: main.$green-light;
            color: main.$green !important;
            padding: 2px 4px;
            border-radius: 2px;
            flex-grow: 0 !important;
        }
    }
}

@include main.device_m {
    .stats {
        img {
            width: 24px;
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
    .stats {
        grid-template-columns: none;

        img {
            display: none;
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
</style>

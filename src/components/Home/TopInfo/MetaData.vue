<template>
    <div>
        <div class="header">
            <h2 class="meta_title">
                Network Activity
                <TooltipHeading content="key figures of the Avalanche network"></TooltipHeading>
            </h2>
        </div>
        <section class="stats">
            <article class="meta">
                <img src="@/assets/ava_transactions-purple.png" />
                <div class="stat">
                    <p class="label">
                        24h Transactions
                        <TooltipMeta
                            content="total number of queries or modifications of the states of all blockchains on the Avalanche network in the past 24 hours"
                        ></TooltipMeta>
                    </p>
                    <div v-if="assetsLoaded">
                        <p class="meta_val">
                            {{totalTransactions.toLocaleString()}}
                            <span class="unit">({{tpmText}} TPM)</span>
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
                    </div>
                </div>
            </article>
            <article class="meta">
                <img src="@/assets/ava_price-purple.png" />
                <div class="stat">
                    <p class="label">
                        24h Volume
                        <TooltipMeta
                            content="total value of $AVAX tokens transferred on the Avalanche network in the past 24 hours"
                        ></TooltipMeta>
                    </p>
                    <div v-if="assetsLoaded">
                        <p class="meta_val">
                            {{avaxVolume}}
                            <span class="unit">AVAX</span>
                        </p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                    <div v-else>
                        <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
                    </div>
                </div>
            </article>
            <article class="meta">
                <img src="@/assets/validators-purple.png" />
                <div class="stat">
                    <p class="label">
                        Validators
                        <TooltipMeta
                            content="Total number of nodes participating in the consensus protocol of the Avalanche network"
                        ></TooltipMeta>
                    </p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">{{validatorCount.toLocaleString()}}</p>
                        <!--<p class="change">+ 24%</p>-->
                    </div>
                    <div v-else>
                        <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
                    </div>
                </div>
            </article>
            <article class="meta">
                <img src="@/assets/stake_amount-purple.png" />
                <div class="stat">
                    <p class="label">
                        Total Staked
                        <TooltipMeta
                            content="total value of $AVAX tokens used as a scarce resource to secure the Avalanche network using the Proof-of-Stake method"
                        ></TooltipMeta>
                    </p>
                    <div v-if="subnetsLoaded">
                        <p class="meta_val">
                            {{totalStake}}
                            <span class="unit">AVAX</span>
                        </p>
                    </div>
                    <div v-else>
                        <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate key="1"></v-progress-circular>
                    </div>
                </div>
            </article>
        </section>
    </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";

import axios from "@/axios";
import { stringToBig } from "@/helper";
import TooltipHeading from "../../misc/TooltipHeading.vue";
import TooltipMeta from "../TopInfo/TooltipMeta.vue";
import { AVAX_ID } from "@/store/index";

@Component({
    components: {
        TooltipHeading,
        TooltipMeta
    }
})
export default class MetaData extends Vue {
    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded;
    }

    get subnetsLoaded(): boolean {
        return this.$store.state.Platform.subnetsLoaded;
    }

    get tpmText(): string {
        let day = 60 * 24;
        let avg = this.totalTransactions / day;
        return avg > 1 ? avg.toFixed(0) : avg.toFixed(2);
    }

    get tpsText(): string {
        let day = 60 * 60 * 24;
        let avg = this.totalTransactions / day;
        return avg > 1 ? avg.toFixed(0) : avg.toFixed(2);
    }

    get totalStake(): string {
        let res = this.$store.getters["Platform/totalStake"];
        res = stringToBig(res.toString(), 9).toFixed(0);
        return parseInt(res).toLocaleString();
    }

    get validatorCount(): number {
        return this.$store.getters["Platform/totalValidators"];
    }

    get avaxVolume(): string {
        let assets = this.$store.state.assets;
        let avax = assets[AVAX_ID];
        return !avax
            ? (0).toLocaleString()
            : parseInt(avax.volume_day.toFixed(0)).toLocaleString();
    }

    get totalTransactions(): number {
        return this.$store.getters.totalTransactions;
    }
}

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
            font-size: 11px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .meta_val {
            font-size: 18px;
            line-height: 1em;

            .unit {
                font-size: 12px;
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

<template>
    <div class="stats">
        <div class="header">
            <h3 class="meta_title">Staking Stats</h3>
            <p class="subtitle"></p>
        </div>
        <article class="meta">
            <p class="label">
                Total Staked
                <TooltipMeta
                    content="Total value of AVAX locked to secure Avalanche"
                    :color="'#2196f3'"
                />
            </p>
            <div>
                <p v-if="subnetsLoaded" class="meta_val">
                    {{ totalStake }}
                    <span class="unit">AVAX</span>
                </p>
                <v-progress-circular
                    v-else
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </div>
        </article>
        <article class="meta">
            <p class="label">
                Staking Ratio
                <TooltipMeta
                    content="Percentage of AVAX locked to secure Avalanche out of total AVAX supply (360m)"
                    :color="'#2196f3'"
                />
            </p>
            <div>
                <p v-if="subnetsLoaded" class="meta_val">
                    {{ percentStaked }}%
                </p>
                <v-progress-circular
                    v-else
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </div>
        </article>
        <article class="meta">
            <p class="label">Annual Staking Reward</p>
            <div>
                <p v-if="subnetsLoaded" class="meta_val">
                    {{ annualStakingRewardPercentage }}
                </p>
                <v-progress-circular
                    v-else
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import TooltipMeta from '@/components/Home/TopInfo/TooltipMeta.vue'
import { stringToBig } from '@/helper'

@Component({
    components: {
        TooltipMeta,
    },
})
export default class ValidatorStats extends Vue {
    get subnetsLoaded(): boolean {
        return this.$store.state.Platform.subnetsLoaded
    }

    // Data from Avalanche-Go
    get totalStake(): string {
        let res = this.$store.getters['Platform/totalStake']
        res = stringToBig(res.toString(), 9).toFixed(0)
        return parseInt(res).toLocaleString()
    }

    get percentStaked(): string {
        return this.$store.getters['Platform/stakingRatio']
    }

    get annualStakingRewardPercentage(): string {
        const APR = this.$store.state.Platform.annualStakingRewardPercentage
        return `${APR.toFixed(1)}%`
    }
}
</script>

<style scoped lang="scss">
.header {
    padding-bottom: 30px;
}

h3 {
    margin: 0;
    font-weight: 400;
}

.subtitle {
    margin-top: 0.2em;
    font-size: 0.875rem;
}
.stats {
    display: flex;
    flex-direction: column;

    .meta {
        font-size: 12px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        font-weight: 700;
        padding-bottom: 24px;

        &:last-of-type {
            padding-bottom: 0;
        }

        .stat {
            display: flex;
            flex-direction: column;

            &:hover {
                text-decoration: none !important;
                opacity: 0.7;
            }
        }

        .stat > div {
            display: flex;
        }

        p {
            padding: 2px 0;
            font-weight: 400;
        }

        .label {
            text-transform: capitalize;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 6px;
            padding-left: 3px;
        }

        .meta_val {
            font-size: 36px;
            font-weight: 300;
            line-height: 1em;

            .unit {
                font-family: 'Rubik', sans-serif;
                font-size: 12px;
                opacity: 0.7;
            }
        }
    }
}
</style>
